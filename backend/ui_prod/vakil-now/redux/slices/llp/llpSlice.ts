import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { submitLlpEsign, submitPartners } from './llpThunk';

/* ===================== TYPES ===================== */

export interface NameFinalizationState {
  companyName: string;
  alternateName1?: string;
  alternateName2?: string;
  alternateName3?: string;
  object?: string;
}

export interface NameCheckState {
  available: boolean | null;
  message: string;
  loading: boolean;
  suggestions?: string;
}

export interface PartnerFiles {
  picture: File | string | null;
  identityProof: File | string | null;
  residentialProof: File | string | null;
  panCard: File | string | null;
  removePicture?: boolean;
  removeIdentityProof?: boolean;
  removeResidentialProof?: boolean;
  removePanCard?: boolean;
}

/* ✅ NEW: ONLY FOR esignDocuments */
export interface EsignDocument {
  fileName: string;
  pdfKey: string;
  signedUrl?: string;
  signed?: boolean;
}

export interface Partner {
  id?: string;
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
  dinNumber?: string;
  files: PartnerFiles;

  /* ✅ ONLY CHANGE HERE */
  esignDocuments?: {
    form9?: EsignDocument;
  };
}

export interface DocumentInfo {
  fileName: string;
  signedUrl: string;
}

export interface LlpInfoState {
  email: string;
  mobileNumber1: string;
  mobileNumber2?: string;
  address: string;
  durationOfStay: string;
  residentialProofUrl?: string;
  nocUrl?: string;

  // ✅ FIX: now supports filename + URL
  subscriberSheetUrl?: DocumentInfo | null;
}

// /* ❌ llpInfo LEFT UNCHANGED */
// export interface LlpInfoState {
//     email: string;
//     mobileNumber1: string;
//     mobileNumber2?: string;
//     address: string;
//     durationOfStay: string;
//     residentialProofUrl?: string;
//     nocUrl?: string;
//     subscriberSheetUrl?: string;
// }


export interface StepStatus {
  nameFinalization: boolean;
  partners: boolean;
  llpInfo: boolean;
  esign: boolean;
}

export interface LlpState {
  llpId: string | null;
  fileId: number ;
  stepStatus?: StepStatus;
  nameFinalization: NameFinalizationState;
  nameCheck: NameCheckState;
  partners: Partner[];
  llpInfo?: LlpInfoState;
  submitPartnersStatus: 'idle' | 'loading' | 'success' | 'error';
  submitPartnersError?: string;
}

/* ===================== INITIAL STATE ===================== */



const initialState: LlpState = {
  llpId: null,
  fileId: 0,
  stepStatus: {
    nameFinalization: false,
    partners: false,
    llpInfo: false,
    esign: false
  },
  nameFinalization: {
    companyName: '',
    alternateName1: '',
    alternateName2: '',
    alternateName3: '',
    object: ''
  },
  nameCheck: {
    available: null,
    message: '',
    loading: false
  },
  partners: [],
  submitPartnersStatus: 'idle'
};

/* ===================== SLICE ===================== */

const llpSlice = createSlice({
  name: 'llp',
  initialState,
  reducers: {
    setLlpId (state, action: PayloadAction<string>) {
      state.llpId = action.payload;
    },
    clearLlpId (state) {
      state.llpId = null;
    },
    saveNameFinalization (state, action: PayloadAction<NameFinalizationState>) {
      state.nameFinalization = action.payload;
    },
    saveNameCheck (state, action: PayloadAction<NameCheckState>) {
      state.nameCheck = action.payload;
    },
    savePartner (state, action: PayloadAction<Partner>) {
      state.partners.push(action.payload);
    },
    replacePartners (state, action: PayloadAction<Partner[]>) {
      state.partners = action.payload;
    },
    clearPartners (state) {
      state.partners = [];
    },
    saveLlpInfo (state, action: PayloadAction<Partial<LlpInfoState>>) {
      if (!state.llpInfo) {
        state.llpInfo = {
          email: action.payload.email ?? '',
          mobileNumber1: action.payload.mobileNumber1 ?? '',
          mobileNumber2: action.payload.mobileNumber2,
          address: action.payload.address ?? '',
          durationOfStay: action.payload.durationOfStay ?? '',
          residentialProofUrl: action.payload.residentialProofUrl,
          nocUrl: action.payload.nocUrl,
          subscriberSheetUrl: action.payload.subscriberSheetUrl
        };
      } else {
        state.llpInfo = {
          ...state.llpInfo,
          ...action.payload
        };
      }
    },
    saveStepStatus (state, action: PayloadAction<StepStatus>) {
      state.stepStatus = action.payload;
    },
      setfileId (state, action: PayloadAction<number>) {
        state.fileId = action.payload;
    },
  },


  extraReducers: (builder) => {
    builder.addCase(submitLlpEsign.fulfilled, (state, action) => {
      const { subscriberSheetUrl, partnerFilesUrls } = action.payload;

      /* ---------- LLP INFO ---------- */
      if (!state.llpInfo) {
        state.llpInfo = {
          email: '',
          mobileNumber1: '',
          address: '',
          durationOfStay: '',
          subscriberSheetUrl
        };
      } else {
        state.llpInfo.subscriberSheetUrl = subscriberSheetUrl;
      }

      /* ---------- PARTNERS ---------- */
      state.partners = state.partners.map((partner) => {
        if (!partner.id) return partner;

        const doc = partnerFilesUrls?.[partner.id];
        if (!doc) return partner;

        return {
          ...partner,
          esignDocuments: {
            ...partner.esignDocuments,
            form9: {
              fileName: doc.fileName,
              signedUrl: doc.signedUrl,
              signed: true,
              pdfKey: doc.fileName
            }
          }
        };
      });
    });
  
      builder
        .addCase(submitPartners.pending, (state) => {
          state.submitPartnersStatus = 'loading';
        })

        .addCase(submitPartners.fulfilled, (state, action) => {
          state.submitPartnersStatus = 'success';
          state.partners = action.payload;
        })

        .addCase(submitPartners.rejected, (state, action) => {
          state.submitPartnersStatus = 'error';
          state.submitPartnersError =
            action.error.message ?? 'Failed to save partners';
        });
    

    // builder.addCase(submitPartners.fulfilled, (state, action) => {
    //   // state.partners = action.payload.map((updated) => {
    //   //   const existing = state.partners.find(p => p.id === updated.id);
    //   //   if (!existing) return updated;

    //   //   const mergedFiles = { ...existing.files };

    //   //   (['picture', 'identityProof', 'residentialProof', 'panCard'] as const)
    //   //     .forEach((key) => {
    //   //       const removeKey = `remove${key[0].toUpperCase()}${key.slice(1)}` as
    //   //         | 'removePicture'
    //   //         | 'removeIdentityProof'
    //   //         | 'removeResidentialProof'
    //   //         | 'removePanCard';

    //   //       // 🔥 RULE 1: if backend confirms removal → keep null
    //   //       if (updated.files?.[key] === null) {
    //   //         mergedFiles[key] = null;
    //   //         return;
    //   //       }

    //   //       // 🔥 RULE 2: if backend sent new value → use it
    //   //       if (updated.files?.[key]) {
    //   //         mergedFiles[key] = updated.files[key];
    //   //         return;
    //   //       }

    //   //       // 🔥 RULE 3: otherwise keep existing
    //   //       mergedFiles[key] = existing.files[key];
    //   //     });

    //   //   return {
    //   //     ...updated,
    //   //     files: mergedFiles,
    //   //     esignDocuments: existing.esignDocuments,
    //   //   };
    //   // });
    // });


  }
});

export const {
  setLlpId,
  setfileId,
  clearLlpId,
  saveNameFinalization,
  saveNameCheck,
  savePartner,
  replacePartners,
  clearPartners,
  saveLlpInfo,
  saveStepStatus
} = llpSlice.actions;

export default llpSlice.reducer;
