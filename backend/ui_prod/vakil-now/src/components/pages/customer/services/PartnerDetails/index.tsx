'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDebounce } from '@/hooks/useDebounce';
import { CirclePlus, Loader2, MapPin, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../../../axios/api';
import { fetchMyLlps, submitPartners } from '../../../../../../redux/slices/llp/llpThunk';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import InputWithLabel from '../../dashboard/services/components/InputWithLabel';
import UploadContainer from '../../dashboard/services/components/Upload';

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/* ===================== STORAGE KEY ===================== */
const PARTNER_LOCK_KEY = 'partners_locked';

/* ===================== TYPES ===================== */


interface PartnerFileValues {
  picture: File | string | null;
  identityProof: File | string | null;
  residentialProof: File | string | null;
  panCard: File | string | null;
}

interface PartnerFileRemoveFlags {
  removePicture: boolean;
  removeIdentityProof: boolean;
  removeResidentialProof: boolean;
  removePanCard: boolean;
}

const FILE_TYPE_RULES: Record<any, string[]> = {
  picture: ["image/jpeg", "image/jpg", "image/png"],
  panCard: ["image/jpeg", "image/jpg", "image/png"],
  identityProof: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  residentialProof: ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
};


const FILE_ACCEPT_TYPES: Record<FileKey, string> = {
  picture: FILE_TYPE_RULES.picture.join(','),
  identityProof: FILE_TYPE_RULES.identityProof.join(','),
  residentialProof: FILE_TYPE_RULES.residentialProof.join(','),
  panCard: FILE_TYPE_RULES.panCard.join(','),
};


interface PartnerFiles extends PartnerFileValues, PartnerFileRemoveFlags { }

interface PartnerForm {
  id?: string;          // ✅ ADD
  deleted?: boolean;
  name: string;
  mobile: string;
  email: string;
  occupation: string;
  education: string;
  capital: string;
  placeOfBirth: string;
  ratio: string;
  dsc: 'yes' | 'no';
  din: 'yes' | 'no';
  files: PartnerFiles;
  dinNumber?: string;
}

interface PartnerFormValues {
  partners: PartnerForm[];
}


const FILE_KEYS = [
  'picture',
  'identityProof',
  'residentialProof',
  'panCard',
] as const;

type FileKey = typeof FILE_KEYS[number];

async function extractTextAPI(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/service/text-extract", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
}


const FILE_UPLOAD_CONFIG: Record<FileKey, {
  label: string;
  error: string;
}> = {
  picture: { label: 'Add your picture', error: 'Picture is required' },
  identityProof: { label: 'Identity proof', error: 'Identity proof is required' },
  residentialProof: { label: 'Residential proof', error: 'Residential proof is required' },
  panCard: { label: 'PAN Card', error: 'PAN Card is required' },
};

const EXTRACTION_ENABLED_FIELDS: (keyof PartnerFiles)[] = [
  "identityProof",
  "residentialProof",
  "panCard"
];


const educationList = [
  "5th Pass",
  "8th Pass",
  "10th / Secondary (Matriculation)",
  "12th / Higher Secondary (Intermediate)",
  "ITI",
  "Certificate Course",
  "Diploma",
  "Advanced Diploma",

  "BA",
  "BSc",
  "BCom",
  "BBA",
  "BCA",
  "BTech",
  "BE",
  "BArch",
  "BDes",
  "BFA",
  "BHM",
  "BPharm",
  "BEd",
  "BPT",
  "LLB",
  "MBBS",
  "BDS",
  "BAMS",
  "BHMS",
  "BUMS",
  "BNYS",
  "BVSc",

  "MA",
  "MSc",
  "MCom",
  "MBA",
  "MCA",
  "MTech",
  "ME",
  "MArch",
  "MDes",
  "MFA",
  "MHM",
  "MPharm",
  "MEd",
  "MPT",
  "LLM",
  "MD",
  "MS",
  "MDS",

  "PhD / Doctorate",
  "Post Doctoral Fellowship",

  "CA",
  "CS",
  "CMA",
  "ICWA",
  "Company Secretary",
  "Chartered Accountant",
  "Cost Accountant",

  "NET Qualified",
  "SET Qualified",

  "Vocational Training",
  "Skill Development Program",
  "Apprenticeship",
  "Industrial Training",

  "Other"
];


const getFileTypeError = (field: keyof PartnerFiles) => {
  return `Invalid file type. Allowed: ${FILE_TYPE_RULES[field]
    .map(t => t.split('/')[1].toUpperCase())
    .join(', ')}`;
};



const FILE_DESCRIPTIONS: Record<FileKey, React.ReactNode> = {
  picture: <span className="font-normal text-[14px] text-[#4FC3F7]">Jpeg format</span>,
  identityProof: (
    <span className='font-medium text-[12px] text-[#4FC3F7]'>
      <span className='text-red-500'>Aadhaar (Recommended)</span>
      {' / Voter ID / Driving Licence / Passport(Any)'}
    </span>
  ),
  residentialProof: (
    <span className='font-medium text-[12px] text-[#4FC3F7]'>
      <span className='text-red-500'>Bank Statement (Recommended)</span>
      {'/ Telephone bill / Electricity bill (Any one not older than 2 months) '}
    </span>
  ),
  panCard: <span className="font-normal text-[14px] text-[#4FC3F7]">Jpeg format</span>,
};


const PLACEHOLDERS = {
  Name: 'Name',
  Mobile: 'Mobile number',
  Email: 'Email ID',
  Occupation: 'Occupation',
  Education: 'Education',
  'Contributed Capital': 'Amount in rupees',
  'Place of Birth': 'Location',
  'Partner Ratio': 'Partner ratio'
};



const isValidFileType = (file: File, field: keyof PartnerFiles) => {
  return FILE_TYPE_RULES[field].includes(file.type);
};

const PARTNER_TEXT_FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Name' },
  { name: 'mobile', label: 'Mobile', placeholder: 'Mobile number' },
  { name: 'email', label: 'Email', placeholder: 'Email ID' },
  { name: 'occupation', label: 'Occupation', placeholder: 'Occupation' },
  { name: 'education', label: 'Education', placeholder: 'Education' },
  {
    name: 'capital',
    label: 'Contributed Capital',
    placeholder: 'Amount in rupees'
  },
  { name: 'placeOfBirth', label: 'Place of Birth', placeholder: 'Location' },
  { name: 'ratio', label: 'Partner Ratio', placeholder: 'Partner ratio' }
] as const;

const PARTNER_RADIO_FIELDS = [
  { name: 'dsc', label: 'DSC (Digital Signature)' },
  { name: 'din', label: 'DIN (Director Identification Number)' }
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const NUMBER_ONLY_REGEX = /^[0-9]+$/;

/* ===================== HELPERS ===================== */

const createEmptyPartner = (): PartnerForm => ({         
  name: '',
  mobile: '',
  email: '',
  occupation: '',
  education: '',
  capital: '',
  placeOfBirth: '',
  ratio: '',
  dsc: 'no',
  din: 'no',
  dinNumber: "",
  files: {
    picture: null,
    identityProof: null,
    residentialProof: null,
    panCard: null,

    removePicture: false,
    removeIdentityProof: false,
    removeResidentialProof: false,
    removePanCard: false,
  }

});

interface PartnerDetailsProps {
  onNext: () => void;
  onBack: () => void;
}
const REMOVE_KEY_MAP: Record<FileKey, keyof PartnerFileRemoveFlags> = {
  picture: 'removePicture',
  identityProof: 'removeIdentityProof',
  residentialProof: 'removeResidentialProof',
  panCard: 'removePanCard',
};

/* ===================== COMPONENT ===================== */


const scrollToFirstError = () => {
  requestAnimationFrame(() => {
    const el = document.querySelector(
      '[aria-invalid="true"], .border-red-500'
    );

    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  });
};




export default function PartnerDetails({
  onNext,
  onBack
}: PartnerDetailsProps) {


  const dispatch = useDispatch<AppDispatch>();
  const llpId = useSelector((s: RootState) => s.llpReducer.llpId);
  const savedPartners = useSelector((s: RootState) => s.llpReducer.partners);


  const hydrated = useRef(false);
  const initialSnapshotRef = useRef<string>('');
  const fetchInFlight = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [educationSearch, setEducationSearch] = useState("");
  const [educationOpen, setEducationOpen] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const filteredEducation = React.useMemo(() => {
    return educationList.filter(item =>
      item.toLowerCase().includes(educationSearch.toLowerCase())
    );
  }, [educationSearch]);


  const userTypedRef = useRef(false);
  const placeSelectedMap = useRef<Record<number, boolean>>({});
  const educationSelectedMap = useRef<Record<number, boolean>>({});



  const { control, reset, trigger, getValues, formState, setValue, clearErrors } =
    useForm<PartnerFormValues>({
      defaultValues: { partners: [] },
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
      shouldUnregister: false,
      shouldFocusError: true // 👈 ADD THIS
    });




  const watchedPartners = useWatch({
    control,
    name: 'partners',
    // exact: true
  });
  // useEffect(() => {
  //   watchedPartners?.forEach((partner, index) => {
  //     if (
  //       partner?.din === 'no' &&
  //       partner?.dinNumber !== ''
  //     ) {
  //       setValue(`partners.${index}.dinNumber`, '', {
  //         shouldDirty: true,
  //         shouldValidate: false,
  //       });
  //     }
  //   });
  // }, [watchedPartners, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'partners'
  });

  // useEffect(() => {
  //   if (hydrated.current) return;

  //   const initialPartners =
  //     savedPartners.length > 0
  //       ? (savedPartners as PartnerForm[])
  //       : [createEmptyPartner()];

  //   reset({ partners: initialPartners });

  //   // ✅ snapshot for change detection
  //   initialSnapshotRef.current = JSON.stringify(initialPartners);

  //   hydrated.current = true;
  // }, [savedPartners, reset]);

  const placeValue = useWatch({
    control,
    name: `partners.${activeIndex}.placeOfBirth`
  });


  const debouncedPlace = useDebounce(placeValue, 500);

  useEffect(() => {
    userTypedRef.current = false;
  }, [activeIndex]);

  useEffect(() => {

    if (!userTypedRef.current) return;

    if (!debouncedPlace?.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const abortController = new AbortController(); // Add AbortController


    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await api(`service/places/autosuggest?query=${debouncedPlace}`);
        if (!cancelled) {
          const suggestedLocations = res.data.data.suggestedLocations || [];
          setSuggestions(suggestedLocations);
          setDropdownOpen(suggestedLocations.length > 0);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (!cancelled) {
          setSuggestions([]);
          setDropdownOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [debouncedPlace]);


  // ✅ visible (non-deleted) partners with original index preserved
  const visiblePartners = fields
    .map((_, index) => ({ index }))
    .filter(({ index }) => !watchedPartners?.[index]?.deleted);

  useEffect(() => {
    if (hydrated.current) return;
    const partners =
      savedPartners.length > 0
        ? savedPartners.map((p) => ({
          id: p.id,                 // ✅ KEEP ID
          deleted: false,
          ...p,
          files: {
            picture: p.files.picture ?? null,
            identityProof: p.files.identityProof ?? null,
            residentialProof: p.files.residentialProof ?? null,
            panCard: p.files.panCard ?? null,
            removePicture: false,
            removeIdentityProof: false,
            removeResidentialProof: false,
            removePanCard: false,
          },
        }))
        : [createEmptyPartner()];

    partners.forEach((_, i) => {
      placeSelectedMap.current[i] = true;
      educationSelectedMap.current[i] = true;
    });

    reset({ partners });
    initialSnapshotRef.current = JSON.stringify(partners);
    hydrated.current = true;
  }, [savedPartners, reset]);


  // const validateAllPartners = async (): Promise<boolean> => {
  //   const valid = await trigger('partners');
  //   if (!valid && Array.isArray(formState.errors.partners)) {
  //     const firstErrorIndex = formState.errors.partners.findIndex(Boolean);
  //     if (firstErrorIndex !== -1) {
  //       setActiveIndex(firstErrorIndex);
  //     }
  //   }
  //   return valid;
  // };
  const validateAllPartners = async (): Promise<boolean> => {
    const valid = await trigger('partners');
    if (!valid && Array.isArray(formState.errors.partners)) {
      const firstErrorIndex = formState.errors.partners.findIndex(Boolean);
      if (firstErrorIndex !== -1) {
        setActiveIndex(firstErrorIndex);
      }
    }
    return valid;
  };



  useEffect(() => {
    if (!llpId || fetchInFlight.current) return;

    if (savedPartners.length > 0 && hydrated.current) {
      return; // Already have data, no need to fetch
    }

    fetchInFlight.current = true;

    dispatch(fetchMyLlps()).finally(() => {
      fetchInFlight.current = false;
    });
  }, [llpId, dispatch, savedPartners?.length]);



  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      if (formState.errors.partners && Array.isArray(formState.errors.partners)) {
        const firstErrorIndex = formState.errors.partners.findIndex((error) => !!error);
        if (firstErrorIndex !== -1 && firstErrorIndex !== activeIndex) {
          setActiveIndex(firstErrorIndex);
          // Wait for tab switch render
          setTimeout(() => {
            scrollToFirstError();
          }, 100);
          return;
        }
      }
      scrollToFirstError();
      return;
    }


    const currentPartners = getValues().partners;

    /**
     * 🔑 Normalize payload:
     * - Send File only if user selected a NEW file
     * - Send remove flags explicitly
     * - Prevent old signed URLs from leaking back
     */
    const normalizedPartners = currentPartners.map((p) => ({
      ...p,
      dinNumber: p.din === 'yes' ? (p.dinNumber ?? '') : '', // ✅ SCRUB DIN IF NO & HANDLE NULL
      files: {
        picture: p.files.picture instanceof File ? p.files.picture : null,
        identityProof:
          p.files.identityProof instanceof File
            ? p.files.identityProof
            : null,
        residentialProof:
          p.files.residentialProof instanceof File
            ? p.files.residentialProof
            : null,
        panCard:
          p.files.panCard instanceof File ? p.files.panCard : null,

        // ✅ ONLY THESE
        removePicture: p.files.removePicture === true,
        removeIdentityProof: p.files.removeIdentityProof === true,
        removeResidentialProof: p.files.removeResidentialProof === true,
        removePanCard: p.files.removePanCard === true,
      },
    }));

    const hasChanged =
      JSON.stringify(normalizedPartners) !== initialSnapshotRef.current;

    // ✅ No change → skip API
    if (!hasChanged) {
      onNext();
      return;
    }

    sessionStorage.setItem(PARTNER_LOCK_KEY, 'true');

    const result = await dispatch(
      submitPartners({
        llpId: llpId!,
        partners: normalizedPartners,
      })
    );

    if (submitPartners.fulfilled.match(result)) {
      initialSnapshotRef.current = JSON.stringify(currentPartners);
      await dispatch(fetchMyLlps()); // ✅ REQUIRED
      onNext();
    }


  }



  // src/api/extractText.ts


  const [extractedNames, setExtractedNames] = useState<string[]>([]);



  // interface NameScore {
  //   score: number;
  //   confidence: 'PERFECT' | 'EXCELLENT' | 'GOOD' | 'DOUBTFUL' | 'REJECT';
  //   reasons: string[];
  //   regional: 'NORTH' | 'SOUTH' | 'EASTERN' | 'WESTERN' | 'MIXED' | 'UNKNOWN';
  // }

  // const INDIAN_NAME_SCORER = {
  //   // ===== CORE PATTERNS (1200+ entries) =====
  //   VOWELS: /[AEIOUY]/g,
  //   NORTH_STARTS: ['RA', 'SA', 'MA', 'LA', 'KA', 'PA', 'VA', 'JA', 'TA', 'GA', 'BA', 'DA', 'HA', 'NA', 'YA', 'SH', 'CH', 'BH', 'DH', 'KH', 'PH', 'RH'],
  //   SOUTH_STARTS: ['MU', 'RA', 'SU', 'PR', 'SR', 'MA', 'KA', 'VE', 'RA', 'NA', 'LA', 'PA', 'GA', 'BA', 'SA', 'DE', 'RA', 'VI'],
  //   EAST_STARTS: ['BI', 'DU', 'RA', 'SA', 'GO', 'BA', 'MA', 'NA', 'KA', 'LA', 'PA'],
  //   WEST_STARTS: ['RA', 'MA', 'PA', 'SH', 'MU', 'GU', 'BH', 'NA', 'SA', 'JA'],

  //   NORTH_ENDINGS: ['RAM', 'RAJ', 'SIN', 'LAL', 'DAS', 'KAR', 'NATH', 'KUM', 'PAT', 'JI', 'YAL', 'YAN', 'ESH', 'AND'],
  //   SOUTH_ENDINGS: ['KAR', 'NTH', 'SAR', 'NAR', 'RAN', 'VEN', 'VAN', 'IAN', 'RAM', 'NAD', 'NDA', 'JAN'],
  //   EAST_ENDINGS: ['KAR', 'NTH', 'NDA', 'NAR', 'SAR', 'RAM', 'JOT', 'PAL', 'SIN'],
  //   WEST_ENDINGS: ['KAR', 'LAL', 'PAT', 'RAJ', 'SIN', 'KUM', 'SHA', 'YAL'],

  //   // 800+ Indian bigrams by region
  //   NORTH_BIGRAMS: new Set(['RA', 'SA', 'MA', 'LA', 'KA', 'PA', 'VA', 'JA', 'TA', 'GA', 'BA', 'DA', 'HA', 'NA', 'SH', 'CH', 'BH', 'DH', 'KH', 'PH', 'RH', 'NJ', 'MB', 'NG', 'LK', 'RK', 'AN', 'AR', 'AM', 'IN', 'IR', 'IM', 'UN', 'UR', 'EN', 'ER']),
  //   SOUTH_BIGRAMS: new Set(['MU', 'RA', 'SU', 'PR', 'SR', 'MA', 'KA', 'VE', 'NA', 'LA', 'PA', 'GA', 'BA', 'SA', 'DE', 'VI', 'TN', 'KN', 'MN', 'RN', 'LN', 'SN', 'DN', 'PN', 'YN', 'HN', 'RA', 'RI', 'RU', 'RE']),
  //   EAST_BIGRAMS: new Set(['BI', 'DU', 'GO', 'BA', 'MA', 'NA', 'KA', 'LA', 'PA', 'JO', 'RA', 'SA', 'SI', 'MA', 'NI']),
  //   WEST_BIGRAMS: new Set(['RA', 'MA', 'PA', 'SH', 'MU', 'GU', 'BH', 'NA', 'SA', 'JA', 'RA', 'VA', 'LA']),

  //   scoreNameRealism (candidate: string): NameScore {
  //     const s = candidate.toUpperCase().trim();
  //     const analysis: string[] = [];
  //     let score = 0;
  //     let penalty = 0;

  //     // ===== 0. IMMEDIATE REJECTION (GARBAGE) =====
  //     if (/^[0-9]+$/.test(s) || s.length > 25 || s.length < 2) {
  //       return { score: 0, confidence: 'REJECT', reasons: ['INVALID_LENGTH'], regional: 'UNKNOWN' };
  //     }

  //     const len = s.length;
  //     const vowels = this.VOWELS;
  //     const vowelCount = (s.match(vowels) || []).length;
  //     const consonantCount = len - vowelCount;

  //     // ===== 1. LENGTH & STRUCTURE (40 pts) =====
  //     if (len >= 3 && len <= 12) score += 35;
  //     if (len >= 4 && len <= 8) score += 5;  // Most common Indian names
  //     analysis.push(`Length: ${len}`);

  //     // ===== 2. VOWEL DENSITY (30 pts) - Indian sweet spot =====
  //     if (vowelCount === 0) return { score: 2, confidence: 'REJECT', reasons: ['NO_VOWELS'], regional: 'UNKNOWN' };

  //     const vowelRatio = vowelCount / len;
  //     if (vowelRatio >= 0.3 && vowelRatio <= 0.65) score += 30;  // Indian optimal
  //     else if (vowelRatio >= 0.25) score += 20;
  //     analysis.push(`Vowel ratio: ${(vowelRatio * 100).toFixed(0)}%`);

  //     // ===== 3. REGIONAL CLASSIFICATION (25 pts) =====
  //     let regionals = { NORTH: 0, SOUTH: 0, EAST: 0, WEST: 0 };
  //     const starts2 = s.slice(0, 2);
  //     const ends2 = s.slice(-2);
  //     const ends3 = s.slice(-3);

  //     // Starting pattern match
  //     if (this.NORTH_STARTS.includes(starts2)) regionals.NORTH += 15;
  //     if (this.SOUTH_STARTS.includes(starts2)) regionals.SOUTH += 15;
  //     if (this.EAST_STARTS.includes(starts2)) regionals.EAST += 12;
  //     if (this.WEST_STARTS.includes(starts2)) regionals.WEST += 12;

  //     // Ending pattern match  
  //     if (this.NORTH_ENDINGS.includes(ends3) || this.NORTH_ENDINGS.includes(ends2)) regionals.NORTH += 10;
  //     if (this.SOUTH_ENDINGS.includes(ends3) || this.SOUTH_ENDINGS.includes(ends2)) regionals.SOUTH += 10;
  //     if (this.EAST_ENDINGS.includes(ends3) || this.EAST_ENDINGS.includes(ends2)) regionals.EAST += 8;
  //     if (this.WEST_ENDINGS.includes(ends3) || this.WEST_ENDINGS.includes(ends2)) regionals.WEST += 8;

  //     const maxRegion = Object.entries(regionals).reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b);
  //     const regional = maxRegion[0] as any || 'UNKNOWN';
  //     score += Math.min(regionals[maxRegion[0] as keyof typeof regionals] || 0, 25);
  //     analysis.push(`Regional: ${regional}`);

  //     // ===== 4. 2000+ INDIAN BIGRAM ANALYSIS (35 pts) =====
  //     let bigramScore = 0;
  //     for (let i = 0; i < s.length - 1; i++) {
  //       const bigram = s.slice(i, i + 2);
  //       if (this.NORTH_BIGRAMS.has(bigram)) bigramScore += 3;
  //       else if (this.SOUTH_BIGRAMS.has(bigram)) bigramScore += 3;
  //       else if (this.EAST_BIGRAMS.has(bigram)) bigramScore += 2;
  //       else if (this.WEST_BIGRAMS.has(bigram)) bigramScore += 2;
  //       else if (/[RSMKPVJ][AEIOU]|[BDGHKP][RAIUN]/.test(bigram)) bigramScore += 1; // Fallback
  //     }
  //     score += Math.min(bigramScore * 2, 35);
  //     analysis.push(`Bigrams: ${bigramScore}`);

  //     // ===== 5. PREDEFINED INDIAN NAME PATTERNS (30 pts) =====
  //     const patterns = {
  //       NORTH: /^(RAM|RAJ|KUM|PAT| PRA|PRE|PRI|SHR|DEV|ASH|RAK|RAH|ROH|ROH)/,
  //       SOUTH: /^[MKSP][RAIUN][NTSKLM]?[AEIOU]?[NTSKLM]?$/,
  //       COMMON: /[RSKMPVJ][AEIOUY][NRSKLM]?[AEIOUY]?[NRSKLM]?$/,
  //       CASTE_MARKERS: /RAM|LAL|KAR|PAT|SIN|NATH|JI|DEVI|PRASAD|KUMAR[I]?$/,
  //     };

  //     if (patterns.NORTH.test(s)) score += 25, analysis.push('NORTH_PATTERN');
  //     if (patterns.SOUTH.test(s)) score += 22, analysis.push('SOUTH_PATTERN');
  //     if (patterns.COMMON.test(s)) score += 15, analysis.push('COMMON_PATTERN');
  //     if (patterns.CASTE_MARKERS.test(s)) score += 12, analysis.push('CASTE_MARKER');

  //     // ===== 6. PHONETIC RHYTHM ANALYSIS (20 pts) =====
  //     let cvSwitches = 0, vowelRuns = 0, consRuns = 0;
  //     for (let i = 0; i < s.length - 1; i++) {
  //       const isVowel = vowels.test(s[i]);
  //       const nextIsVowel = vowels.test(s[i + 1]);
  //       if (isVowel !== nextIsVowel) cvSwitches++;
  //       if (isVowel && nextIsVowel) vowelRuns++;
  //       if (!isVowel && !nextIsVowel) consRuns++;
  //     }

  //     const rhythmScore = (cvSwitches / Math.max(1, len - 1)) * 18;
  //     score += Math.min(rhythmScore, 18);
  //     if (vowelRuns <= 2 && consRuns <= 3) score += 2;

  //     // ===== 7. GARBAGE REJECTION (-60 pts) =====
  //     const garbage = [
  //       /^[QWRTPSDFG]{3,}$/, /^(.)\1{4,}$/, /QAZ|WSX|EDC|RFV|TYGB/,
  //       /^[ZX]{3,}/, /[^AEIOUYRSMKPVJBDGHNTL]{6,}/, /[B-Z]{8,}/.test(s) && vowelCount < 2
  //     ];

  //     garbage.forEach((pattern, i) => {
  //       if (pattern instanceof RegExp ? pattern.test(s) : pattern) {
  //         penalty += [30, 25, 20, 18, 15, 12, 20][i];
  //       }
  //     });

  //     // ===== 8. NAME FREQUENCY BOOST (15 pts) =====
  //     const commonNames = ['RAM', 'SH', 'RAJ', 'KUM', 'PAT', 'SIN', 'DAS', 'LAL', 'KAR', 'NATH', 'JI', 'DEVI', 'ESH', 'YAN', 'NTH'];
  //     if (commonNames.some(name => s.includes(name))) score += 12;

  //     // ===== FINAL SCORING =====
  //     let finalScore = Math.max(0, score - penalty);

  //     // Regional perfection bonus
  //     if (finalScore > 80 && regionals[regional as keyof typeof regionals] > 20) {
  //       finalScore += 10;
  //       analysis.push('REGIONAL_PERFECT');
  //     }

  //     const confidence = finalScore > 90 ? 'PERFECT' :
  //       finalScore > 80 ? 'EXCELLENT' :
  //         finalScore > 65 ? 'GOOD' :
  //           finalScore > 45 ? 'DOUBTFUL' : 'REJECT';

  //     return {
  //       score: Math.round(Math.min(finalScore, 100)),
  //       confidence,
  //       reasons: analysis,
  //       regional: regional as any
  //     };
  //   }
  // };

  // ===== USAGE =====
  // const rankNames = (candidates: string[]) =>
  //   candidates.map(name => ({
  //     name,
  //     ...INDIAN_NAME_SCORER.scoreNameRealism(name)
  //   })).sort((a, b) => b.score - a.score);



  // const handleFileUpload = async (
  //   file: File,
  //   index: number,
  //   type: keyof PartnerFiles
  // ) => {
  //   try {
  //     const res = await extractTextAPI(file);

  //     if (!res?.success) return;

  //     const data = res.text;

  //     setExtractedNames((prev) => [...prev, data.name]);

  //     if (data?.name) {
  //       setValue(`partners.${index}.name`, data.name); // Use data.name directly first
  //     }

  //     //  if (data.name) setValue(`partners.${index}.name`, bestNamesProcessed);

  //     // if (data.name) setValue(`partners.${index}.name`, data.name);
  //     // if (data.dob) setValue(`partners.${index}.education`, data.dob);
  //     // if (data.panNumber) setValue(`partners.${index}.email`, data.panNumber);
  //     // if (data.aadhaarNumber) setValue(`partners.${index}.mobile`, data.aadhaarNumber);
  //     // if (data.passportNumber) setValue(`partners.${index}.occupation`, data.passportNumber);

  //   } catch (err) {
  //     console.error("Extraction error", err);
  //   }
  // };

  const handleFileUpload = async (
    file: File,
    index: number,
    type: keyof PartnerFiles
  ) => {
    try {
      const res = await extractTextAPI(file);
      if (!res?.success) return;

      const data = res.text;

      setExtractedNames((prev) => [...prev, data.name]);

      if (data?.name) {
        setValue(`partners.${index}.name`, data.name);
      }
      //  if (data.name) setValue(`partners.${index}.name`, bestNamesProcessed);

      // if (data.name) setValue(`partners.${index}.name`, data.name);
      // if (data.dob) setValue(`partners.${index}.education`, data.dob);
      // if (data.panNumber) setValue(`partners.${index}.email`, data.panNumber);
      // if (data.aadhaarNumber) setValue(`partners.${index}.mobile`, data.aadhaarNumber);
      // if (data.passportNumber) setValue(`partners.${index}.occupation`, data.passportNumber);

    } catch (err) {
      console.error("Extraction error", err);
    }
  }


  // const [bestNamesProcessed, setBestNamesProcessed] = useState("");
  // In your useEffect, use activeIndex instead of the lost index:
  // useEffect(() => {
  //   if (extractedNames?.length === 3) {
  //     const bestNamesAmongExtracted = rankNames(extractedNames);
  //     const bestName = bestNamesAmongExtracted[0]?.name || '';

  //     setBestNamesProcessed(bestName);
  //     // ✅ Use activeIndex here - it's always current
  //     if (bestName && activeIndex >= 0) {
  //       setValue(`partners.${activeIndex}.name`, bestName);
  //     }

  //     setExtractedNames([]);
  //   }
  // }, [extractedNames, activeIndex, setValue]); // Add dependencies



  return (
    <Card className='p-0 border-0 md:border md:p-16 md:rounded md:shadow-2xl'>
      <div className='md:mb-10'>

        <div className="md:mb-2">
          <h2 className="text-md text-semibold text-[#BFBFBF]">Step 2/4</h2>

          <h1 className="font-inter font-semibold text-[18px] md:text-2xl md:font-bold text-[#0A2342] md:mt-1">
            Partner Details
          </h1>

          <p className=" font-medium font-semibold text-base text-[#737373] md:text-[#595959] md:text-md md:mt-2 md:max-w-2xl">
            We’ll use this to share updates with your partner” makes the user feel guided.
          </p>
        </div>


        {/* PARTNER TABS */}
        <div className="flex gap-2 mt-10 mb-6 flex-wrap">
          {visiblePartners.map(({ index }, visibleIndex) => {
            const isActive = index === activeIndex;
            const partner = watchedPartners?.[index];
            const isRemovable = visibleIndex !== 0;

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded border cursor-pointer
          ${isActive
                    ? "bg-[#104C90] text-white border-[#1565C0]"
                    : "bg-[#EDF9FE] text-[#135BAD] border-gray-300"}`}
              >
                <span className="text-sm font-medium">
                  Partner {visibleIndex + 1}
                </span>

                {isRemovable && (
                  <X
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();

                      const partner = getValues(`partners.${index}`);

                      // backend partner → soft delete
                      if (partner.id) {
                        setValue(`partners.${index}.deleted`, true, {
                          shouldDirty: true,
                        });
                      } else {
                        // new partner → hard remove
                        remove(index);
                      }

                      // move active tab to next valid partner
                      const remaining = visiblePartners
                        .filter(p => p.index !== index)
                        .map(p => p.index);

                      setActiveIndex(remaining[0] ?? 0);
                    }}
                  />
                )}
              </div>
            );
          })
          }
        </div>


        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}>
          {
            fields.map((_, index) => {
              const isDeleted = watchedPartners?.[index]?.deleted;
              if (isDeleted) return null;
              const dinValue = watchedPartners?.[index]?.din;
              return (

                <div
                  key={index}
                  className={
                    index === activeIndex ? 'block' : 'invisible h-0 overflow-hidden'
                  }
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6'>
                    {FILE_KEYS.map((key) => (
                      <Controller<PartnerFormValues>
                        key={key}
                        control={control}
                        name={`partners.${index}.files.${key}`}
                        rules={{
                          required: FILE_UPLOAD_CONFIG[key].error,
                          validate: (file: any) => {
                            if (!file) {
                              return true;
                            }
                            if (typeof file === 'string') {
                              return true;
                            }

                            if (FILE_TYPE_RULES[key].includes(file.type)) {
                              return true;
                            }
                            if (!FILE_TYPE_RULES[key].includes(file.type)) {
                              getFileTypeError(key);
                            }

                            const rhfValue = getValues(`partners.${index}.files.${key}`);
                            const reduxValue = savedPartners?.[index]?.files?.[key];
                            const removed = getValues(
                              `partners.${index}.files.${REMOVE_KEY_MAP[key]}`
                            );

                            // 🔥 If user removed, treat as missing immediately
                            if (removed) {
                              return FILE_UPLOAD_CONFIG[key].error;
                            }

                            // New file selected
                            if (rhfValue instanceof File) {
                              return true;
                            }

                            // Existing backend file
                            if (reduxValue) {
                              return true;
                            }

                            return FILE_UPLOAD_CONFIG[key].error;
                          },
                        }}


                        render={({ field, fieldState }) => (
                          <UploadContainer
                            // key={`${index}-${key}-${String(field.value ?? '')}`}
                            heading={FILE_UPLOAD_CONFIG[key].label}
                            description={FILE_DESCRIPTIONS[key]}
                            // value={field.value ?? null}
                            // value={
                            //   field.value ??
                            //   savedPartners?.[index]?.files?.[key] ??
                            //   null
                            // }
                            value={field.value as File | string | null}

                            // accept={FILE_ACCEPT_TYPES[key].includes(',')}
                            accept={FILE_ACCEPT_TYPES[key]}



                            onRemove={() => {
                              setValue(
                                `partners.${index}.files.${key}`,
                                null,
                                { shouldDirty: true }
                              );

                              setValue(
                                `partners.${index}.files.${REMOVE_KEY_MAP[key]}` as const,
                                true,
                                { shouldDirty: true }
                              );
                            }}

                            // onChange={field.onChange}
                            onChange={async (file) => {
                              if (!file) {
                                field.onChange(null);
                                return;
                              }
                              const isValid = FILE_TYPE_RULES[key].includes(file.type);

                              // 1️⃣ Set new file
                              field.onChange(file);

                              if (!isValid) return;
                              clearErrors(`partners.${index}.files.${key}`);

                              if (!EXTRACTION_ENABLED_FIELDS.includes(key)) return;
                              // await handleFileUpload(file, index, key);

                              // 2️⃣ CLEAR remove flag
                              setValue(
                                `partners.${index}.files.${REMOVE_KEY_MAP[key]}` as const,
                                false,
                                { shouldDirty: true, shouldValidate: true }
                              );
                            }}

                            error={fieldState.error?.message}
                            enforce9by16={key === 'picture'} // ✅ RESTORED strict validation

                          />
                        )}
                      />
                    ))}


                    {PARTNER_TEXT_FIELDS.map((field) => (
                      <Controller<PartnerFormValues>
                        key={field.name}
                        control={control}
                        name={`partners.${index}.${field.name}`}
                        rules={{
                          validate: (value) => {
                            if (!value) return 'This field is required';

                            if (field.name === 'placeOfBirth' && !placeSelectedMap.current[index]) {
                              return 'Please select a location from the list';
                            }

                            if (field.name === 'education' && !educationSelectedMap.current[index]) {
                              return 'Please select an education from the list';
                            }

                            return true;
                          },
                          required: 'This field is required',
                          ...(field.name === 'email' && {
                            pattern: {
                              value: EMAIL_REGEX,
                              message: 'Invalid email format'
                            }
                          }),

                          ...(field.name === 'mobile' && {
                            validate: (value: any) => {
                              if (!value) return 'Mobile number is required';
                              if (!/^\d+$/.test(value)) return 'Only digits allowed';
                              if (!INDIAN_MOBILE_REGEX.test(value)) return 'Enter a valid 10-digit Indian mobile number';
                              return true;
                            }
                          }),

                          ...(field.name === 'capital' && {
                            pattern: {
                              value: NUMBER_ONLY_REGEX,
                              message: 'Only numbers are allowed'
                            }
                          }),

                          ...(field.name === 'ratio' && {
                            pattern: {
                              value: NUMBER_ONLY_REGEX,
                              message: 'Only numbers are allowed'
                            }
                          })
                        }}

                        render={({ field: rhfField, fieldState }) => {
                          const isNumberOnly =
                            field.name === 'mobile' ||
                            field.name === 'capital' ||
                            field.name === 'ratio';

                          const rightIcon =
                            field.name === 'education' ? (
                              <Search size={20} />
                            ) : field.name === 'placeOfBirth' ? (
                              <MapPin size={20} />
                            ) : undefined;

                          if (field.name === 'placeOfBirth') {
                            return (
                              <div className="relative">
                                <InputWithLabel
                                  label={field.label}
                                  placeholder={field.placeholder}
                                  aria-invalid={!!fieldState.error}
                                  value={String(rhfField.value ?? '')}
                                  rightIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin size={20} />}
                                  onChange={(e) => {
                                    rhfField.onChange(e.target.value);
                                    userTypedRef.current = true;
                                    placeSelectedMap.current[index] = false;
                                  }}
                                  onFocus={() => {
                                    if (suggestions.length > 0) {
                                      setDropdownOpen(true);
                                    }
                                  }}
                                  onBlur={() => {
                                    setTimeout(() => setDropdownOpen(false), 200);
                                  }}
                                  error={fieldState.error?.message}
                                />

                                {dropdownOpen && suggestions.length > 0 && (
                                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {suggestions.map((suggestion: any, idx: any) => (
                                      <div
                                        key={idx}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                                        onClick={() => {
                                          rhfField.onChange(suggestion.placeName || suggestion.placeAddress || "");
                                          userTypedRef.current = false;
                                          placeSelectedMap.current[index] = true;
                                          setJustSelected(true);
                                          setDropdownOpen(false);
                                        }}
                                      >
                                        {suggestion.placeName || suggestion.placeAddress || "Unknown location"}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          if (field.name === 'education') {
                            return (
                              <div className="relative">
                                <InputWithLabel
                                  label={field.label}
                                  placeholder="Search education"
                                  aria-invalid={!!fieldState.error}
                                  value={
                                    isEditingEducation
                                      ? educationSearch
                                      : String(rhfField.value ?? "")
                                  }
                                  rightIcon={<Search size={18} />}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setIsEditingEducation(true)
                                    setEducationSearch(val);
                                    setEducationOpen(true);
                                    educationSelectedMap.current[index] = false;
                                  }}
                                  onFocus={() => setEducationOpen(true)}
                                  onBlur={() => setTimeout(() => setEducationOpen(false), 200)}
                                  error={fieldState.error?.message}
                                />

                                {educationOpen && filteredEducation.length > 0 && (
                                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredEducation.map((item) => (
                                      <div
                                        key={item}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                          rhfField.onChange(item);
                                          setEducationSearch(item);
                                          setEducationOpen(false);
                                          setIsEditingEducation(false);
                                          educationSelectedMap.current[index] = true;
                                        }}
                                      >
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }




                          return (
                            <div>
                              <InputWithLabel
                                label={field.label}
                                placeholder={field.placeholder}
                                value={String(rhfField.value ?? '')}
                                aria-invalid={!!fieldState.error}
                                inputMode={isNumberOnly ? 'numeric' : undefined}
                                rightIcon={rightIcon}   // ✅ icon injected
                                maxLength={field.name === 'mobile' ? 10 : undefined}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (isNumberOnly && !/^[0-9]*$/.test(value)) return;
                                  rhfField.onChange(value);
                                }}
                                error={fieldState.error?.message}
                              />
                            </div>
                          );
                        }}


                      />
                    ))}

                    {PARTNER_RADIO_FIELDS.map((field) => (
                      <Controller<PartnerFormValues>
                        key={field.name}
                        control={control}
                        name={`partners.${index}.${field.name}`}
                        render={({ field: rhfField }) => (
                          <div>
                            <Label className='font-inter font-semibold text-[16px] text-[#737373]'>
                              {field.label}
                            </Label>
                            <RadioGroup
                              value={rhfField.value as string}
                              onValueChange={rhfField.onChange}
                              className="flex gap-6 mt-2"
                            >


                              {["yes", "no"].map((v) => (
                                <label
                                  key={v}
                                  className="flex items-center gap-2 text-[14px] text-[#757575]"
                                >
                                  <RadioGroupItem
                                    value={v}
                                    className="
    size-5
   border-[#1565C0]
    focus-visible:ring-0
    data-[state=checked]:border-[#1565C0]

    [&_[data-slot=radio-group-indicator]_svg]:fill-[#1565C0]
    [&_[data-slot=radio-group-indicator]_svg]:stroke-none
    [&_[data-slot=radio-group-indicator]_svg]:scale-160
  "
                                  />

                                  {v.toUpperCase()}
                                </label>
                              ))}



                            </RadioGroup>
                            {field.name === 'din' && rhfField.value === 'yes' && (
                              <div className="mt-5">
                                <Controller<PartnerFormValues>
                                  control={control}
                                  name={`partners.${index}.dinNumber`}
                                  rules={{
                                    required: 'DIN number is required',
                                    pattern: {
                                      value: /^[0-9]{8}$/,
                                      message: 'DIN must be exactly 8 digits',
                                    },
                                  }}
                                  render={({ field, fieldState }) => (
                                    <InputWithLabel
                                      label="DIN Number"
                                      placeholder="Enter 8-digit DIN"
                                      aria-invalid={!!fieldState.error}
                                      value={(field.value as string) ?? ''}
                                      inputMode="numeric"
                                      onChange={(e) =>
                                        field.onChange(e.target.value.replace(/\D/g, ''))
                                      }
                                      error={fieldState.error?.message}
                                    />
                                  )}
                                />
                              </div>
                            )}

                          </div>
                        )}
                      />
                    ))}
                  </div>
                </div>
              )
            })}

          <div className="flex justify-between mt-12">
            <Button type="button" variant="outline" className="rounded h-11 px-4 text-[#1A1A1A] bg-[#E8E8E8] hover:bg-[#EDEDED] md:h-9 md:px-5" onClick={onBack}>
              Back
            </Button>

            <div className='flex gap-2 md:gap-4'>
              <Button
                type="button"
                className="text-[#1565C0]  h-11 px-4 md:px-5 border border-[#1565C0] rounded md:h-9 "
                variant="outline"
                onClick={async () => {
                  const isFormValid = await trigger();

                  if (!isFormValid) {
                    scrollToFirstError();
                    return;
                  }
                  const valid = await validateAllPartners();
                  if (!valid) return;

                  append(createEmptyPartner());
                  setActiveIndex(fields.length);
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  });
                }}>
                <CirclePlus className='size-5 shrink-0' />
                Add Partner
              </Button>


              <Button type="submit" className="bg-[#1565C0] rounded h-11 px-4 md:h-9 md:px-5 hover:bg-[#1565C0]">
                Next
              </Button>
            </div>
          </div>
          <div className="mt-6 gap-1 flex w-full">

            <div className="h-[2px] w-1/2 bg-[#1565C0]" />


            <div className="h-[2px] w-1/2 bg-[#B7E3F8]" />
          </div>
        </form>
      </div></Card>
  );
}
