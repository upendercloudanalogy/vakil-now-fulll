import { Injectable } from '@nestjs/common';
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';

export interface AadhaarResult {
    number: string | null;
    valid: boolean;
}

export interface PassportResult {
    number: string | null;
    valid: boolean;
}

export interface PanResult {
    number: string | null;
    valid: boolean;
}


@Injectable()
export class ServiceService {


    isLabel (line: string) {
        return /name|father|birth|signature|नाम|पिता/i.test(line);
    }

    isValidPAN (pan: string, text: string): boolean {
        if (!pan) return false;

        const t = text.toUpperCase();

        // PAN format
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
            return false;
        }

        // 4th character validation
        const panType = pan[3];
        if (!/[PCHFTABLGJD]/.test(panType)) {
            return false;
        }

        // PAN context keywords
        const hasPanContext =
            t.includes('INCOME TAX DEPARTMENT') ||
            t.includes('PERMANENT ACCOUNT NUMBER') ||
            t.includes('GOVT. OF INDIA');

        return hasPanContext;
    }


    detectDocumentType (text: string) {
        const t = text.toUpperCase();

        const hasPanNumber =
            /\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(t);

        const hasPanKeywords =
            t.includes('INCOME TAX DEPARTMENT') ||
            t.includes('PERMANENT ACCOUNT NUMBER') ||
            t.includes('GOVT. OF INDIA');
        // 1️⃣ PAN (very strong)

        if (hasPanKeywords && hasPanNumber) {
            return 'PAN';
        }

        // 2️⃣ DRIVING LICENCE (strong keywords)
        if (
            t.includes('DRIVING LICENCE') ||
            t.includes('DRIVING LICENSE') ||
            /\bDL\s*NO\b/.test(t)
        ) {
            return 'DL';
        }

        // 3️⃣ PASSPORT
        const hasPassportWord =
            t.includes('PASSPORT') ||
            t.includes('REPUBLIC OF INDIA');

        const hasPassportNumber =
            /\b[A-Z][0-9]{7}\b/.test(t);

        const hasMRZ =
            /^P<IND/m.test(t);

        if (hasMRZ || (hasPassportWord && hasPassportNumber)) {
            return 'PASSPORT';
        }

        const aadhaarNumber =
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(t);
        const hasVID =
            /\bVID\b/.test(t) &&
            /\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/.test(t);

        const hasGovtIndia =
            t.includes('GOVERNMENT OF INDIA');

        // 4️⃣ AADHAAR (LAST + strict)
        if (
            (t.includes('UIDAI') || t.includes('AADHAAR')) &&
            /\b\d{4}\s\d{4}\s\d{4}\b/.test(t)
        ) {
            return 'AADHAAR';
        }

        if (
            (aadhaarNumber && hasGovtIndia) ||
            hasVID ||
            (aadhaarNumber)
        ) {
            return 'AADHAAR';
        }

        return 'UNKNOWN';
    }

    charValue (c: string): number {
        if (c >= '0' && c <= '9') return Number(c);
        if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
        if (c === '<') return 0;
        return 0;
    }

    mrzCheck (data: string, checkDigit: string): boolean {
        const weights = [7, 3, 1];
        let sum = 0;

        for (let i = 0; i < data.length; i++) {
            sum += this.charValue(data[i]) * weights[i % 3];
        }

        return (sum % 10).toString() === checkDigit;
    }

    validatePassportMRZ (line2: string): boolean {
        // Example line2:
        // A1234567<IND9901048F2806149<<<<<<<<

        const passportNumber = line2.substring(0, 9);
        const passportCheck = line2[9];

        const dob = line2.substring(13, 19);
        const dobCheck = line2[19];

        const expiry = line2.substring(21, 27);
        const expiryCheck = line2[27];

        const finalData =
            passportNumber + passportCheck +
            dob + dobCheck +
            expiry + expiryCheck +
            line2.substring(28, 42);

        const finalCheck = line2[42];

        return (
            this.mrzCheck(passportNumber, passportCheck) &&
            this.mrzCheck(dob, dobCheck) &&
            this.mrzCheck(expiry, expiryCheck) &&
            this.mrzCheck(finalData, finalCheck)
        );
    }



    extractDOB (text: string): string | null {
        const match =
            text.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/) ||
            text.match(/\b\d{2}\s[A-Z]{3}\s\d{4}\b/i);

        return match?.[0] || null;
    }


    extractName (text: string): string | null {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        for (const line of lines) {
            if (
                /^[A-Z][A-Z\s]{2,}$/.test(line) &&
                !/GOVERNMENT|INDIA|DEPARTMENT|PASSPORT|INCOME|TAX/.test(line)
            ) {
                return line;
            }
        }
        return null;
    }

    extractParentName (text: string, type: 'FATHER' | 'MOTHER') {
        const regex =
            type === 'FATHER'
                ? /(FATHER(?:'S)? NAME|S\/O)\s*[:\-]?\s*(.+)/i
                : /(MOTHER(?:'S)? NAME|D\/O)\s*[:\-]?\s*(.+)/i;

        const match = text.match(regex);
        return match?.[2]?.trim() || null;
    }

    extractMRZ (text: string): string | null {
        const lines = text.split('\n').map(l => l.trim());
        const mrzLines = lines.filter(l => l.startsWith('P<'));

        if (mrzLines.length >= 2) {
            return mrzLines.slice(0, 2).join('\n');
        }

        return null;
    }



    isValidAadhaar (aadhaar: string): boolean {

        const d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ];

        const p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
        ];

        const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
        const num = aadhaar.replace(/\D/g, '');
        let c = 0;

        num.split('').reverse().forEach((digit, i) => {
            c = d[c][p[i % 8][Number(digit)]];
        });

        return c === 0;
    }

    normalizeText (text: string): string {
        return text
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/[^\d\s]/g, ' ')
            .trim();
    }


    extractAadhaarCandidates (text: string): string[] {
        const cleaned = this.normalizeText(text);

        const regex =
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

        return cleaned.match(regex) || [];
    }

    basicAadhaarFilter (aadhaar: string): boolean {
        const num = aadhaar.replace(/\D/g, '');

        if (num.length !== 12) return false;
        if (/^[01]/.test(num)) return false;
        if (/^(\d)\1{11}$/.test(num)) return false;

        return true;
    }


    extractAadhaar (text: string): AadhaarResult {
        const candidates = this.extractAadhaarCandidates(text);
        for (const c of candidates) {
            if (this.basicAadhaarFilter(c)) {
                const formatted = c.replace(/\D/g, '')
                    .replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');

                return {
                    number: formatted,
                    valid: this.isValidAadhaar(c)
                };
            }
        }

        return { number: null, valid: false };
    }


    extractPAN (text: string): PanResult {
        const match = text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/);
        const pan = match ? match[0] : null;

        return {
            number: pan,
            valid: pan ? this.isValidPAN(pan, text) : false
        };
    }

    extractDL (text: string): string | null {
        if (!text) return null;

        const STATE_CODES = [
            'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL',
            'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS',
            'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY'
        ];

        const STATE = STATE_CODES.join('|');

        const patterns: {
            regex: RegExp;
            build: (m: RegExpMatchArray) => string;
        }[] = [

                // TS1222200000111 / AP1222200000111
                {
                    regex: new RegExp(`\\b(${STATE})\\d{12,16}\\b`, 'i'),
                    build: m => m[0].toUpperCase()
                },

                // Old smart card: DLFAP022105712010
                {
                    regex: /\bDL[A-Z0-9]{13,18}\b/i,
                    build: m => m[0].toUpperCase()
                },

                // MP07R-2021-0197622
                {
                    regex: new RegExp(
                        `\\b(${STATE})(\\d{2})([A-Z])[-\\s]?(\\d{4})[-\\s]?(\\d{6,7})\\b`,
                        'i'
                    ),
                    build: m => `DL${m[1]}${m[2]}${m[3]}${m[4]}${m[5]}`
                },

                // JK-11 2003 0025206
                {
                    regex: new RegExp(
                        `\\b(${STATE})[-\\s]?(\\d{2})\\s+(\\d{4})\\s+(\\d{6,7})\\b`,
                        'i'
                    ),
                    build: m => `DL${m[1]}${m[2]}${m[3]}${m[4]}`
                },

                // HP-32 20140003137
                {
                    regex: new RegExp(
                        `\\b(${STATE})[-\\s]?(\\d{2})\\s+(\\d{4})(\\d{6,7})\\b`,
                        'i'
                    ),
                    build: m => `DL${m[1]}${m[2]}${m[3]}${m[4]}`
                },

                // NUMBER : CG04-20210008418
                {
                    regex: new RegExp(
                        `\\bNUMBER\\s*[:\\-]?\\s*(${STATE})(\\d{2})[-\\s]?(\\d{4})(\\d{6,7})\\b`,
                        'i'
                    ),
                    build: m => `DL${m[1]}${m[2]}${m[3]}${m[4]}`
                },

                // DL CH-0120020000177
                {
                    regex: new RegExp(
                        `\\bDL\\s*(${STATE})[-\\s]?(\\d{2})(\\d{4})(\\d{6,7})\\b`,
                        'i'
                    ),
                    build: m => `DL${m[1]}${m[2]}${m[3]}${m[4]}`
                }
            ];

        for (const p of patterns) {
            const match = text.match(p.regex);
            if (match) {
                return p.build(match);
            }
        }

        return null;
    }



    extractPassport (text: string): PassportResult {
        const passportNumber =
            text.match(/\b[A-Z][0-9]{7}\b/)?.[0] || null;

        const mrz = this.extractMRZ(text);

        // Default: unverified
        let valid = false;

        if (mrz) {
            const lines = mrz.split('\n');
            if (lines.length >= 2) {
                valid = this.validatePassportMRZ(lines[1]);
            }
        }

        return {
            number: passportNumber,
            valid
        };
    }



    extractDocumentData (fullText: string) {
        const docType = this.detectDocumentType(fullText);
        const name = this.extractName(fullText);

        const baseData = {
            documentType: docType,
            name: name,
        };

        switch (docType) {
            case 'AADHAAR': {
                const aadhaar = this.extractAadhaar(fullText);
                return {
                    ...baseData,
                    aadhaarNumber: aadhaar.number,
                    aadhaarValid: aadhaar.valid
                };
            }

            case 'PAN': {
                const pan = this.extractPAN(fullText);
                return {
                    ...baseData,
                    name: this.extractName(fullText),
                    dob: this.extractDOB(fullText),
                    fatherName: this.extractParentName(fullText, 'FATHER'),
                    panNumber: pan.number,
                    panValid: pan.valid
                };
            }


            case 'DL':
                return { ...baseData, dlNumber: this.extractDL(fullText) };

            case 'PASSPORT': {
                const passport = this.extractPassport(fullText);

                return {
                    ...baseData,
                    passportNumber: passport.number,
                    passportValid: passport.valid
                };
            }

            default:
                return {
                    ...baseData,
                    reason: 'No strong ID patterns detected',
                    fullText
                };
        }
    }




    async extractText (buffer: Buffer): Promise<any> {
        const client = new TextractClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!
            }
        });

        const command = new AnalyzeDocumentCommand({
            Document: { Bytes: buffer },
            FeatureTypes: ["FORMS", "TABLES"]
        });

        const result = await client.send(command);

        const textBlocks = result.Blocks?.filter((b: any) => b.BlockType === "LINE" || b.BlockType === "WORD") || [];
        const fullText = textBlocks.map(b => b.Text).join("\n");

        const extractedData = this.extractDocumentData(fullText);

        return extractedData;
    }

    async autoSuggestPlaces (input: string) {
        try {
            const clientId = process.env.MAP_MYINDIA_CLIENT_ID || "";
            const clientSecret = process.env.MAP_MYINDIA_SECRET_KEY || "";
            const existingToken = process.env.MAP_MYINDIA_ACCESS_TOKEN || "";

            if (clientId=="" || clientSecret=="") {
                return {
                    success: false,
                    message: "MapMyIndia client credentials are not set",
                    data: { suggestedLocations: [] }
                };
            }
            // Validate input
            if (!input || input.trim().length <= 2) {
                return {
                    success: false,
                    message: "Input must be at least 2 characters",
                    data: { suggestedLocations: [] }
                };
            }

            let accessToken = existingToken;
            // if(existingToken==""){
            let tokenData;
            try {
                const tokenResponse = await fetch(
                    "https://outpost.mappls.com/api/security/oauth/token",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            grant_type: "client_credentials",
                            client_id: clientId,
                            client_secret: clientSecret,
                        })
                    }
                );

                if (!tokenResponse.ok) {
                    throw new Error(`Token API failed with status: ${tokenResponse.status}`);
                }
                const responseText = await tokenResponse.text();
                if (!responseText) {
                    throw new Error("Empty response from token API");
                }

                tokenData = JSON.parse(responseText);
                if (!tokenData.access_token) {
                    throw new Error("No access token in response");
                }
                accessToken = tokenData.access_token;
            } catch (tokenError: any) {
                if (tokenError.name === 'AbortError') {
                    throw new Error("Token request timeout");
                }
                throw tokenError;
            }




            try {
                const res = await fetch(
                    `https://atlas.mappls.com/api/places/search/autosuggest?query=${encodeURIComponent(input.trim())}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "X-Client-Id": clientId
                        }
                    }
                );

                if (!res.ok) {
                    throw new Error(`Autosuggest API failed with status: ${res.status}`);
                }

                const responseText = await res.text();
                if (!responseText) {
                    return {
                        success: true,
                        message: "No results found",
                        data: { suggestedLocations: [] }
                    };
                }

                const data = JSON.parse(responseText);

                // Transform the response to match your frontend expectations
                const suggestedLocations = data.suggestedLocations ||
                    data.results?.map((item: any) => ({
                        place_id: item.placeId || item.place_id,
                        place_name: item.placeName || item.place_name,
                        ...item
                    })) || [];

                return {
                    success: true,
                    message: "Suggestions retrieved successfully",
                    data: {
                        suggestedLocations,
                        rawData: data // Optional: for debugging
                    }
                };

            } catch (suggestError: any) {
                throw suggestError;
            }

        } catch (error: any) {
            return {
                success: false,
                message: error.message || "Failed to fetch suggestions",
                error: error?.stack,
                data: { suggestedLocations: [] }
            };
        }
    }
}