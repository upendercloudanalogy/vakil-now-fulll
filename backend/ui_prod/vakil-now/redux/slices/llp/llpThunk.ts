import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../axios/api';
import { RootState } from '../../store';
import {
  clearLlpId,
  Partner,
  replacePartners,
  saveLlpInfo,
  saveNameCheck,
  saveNameFinalization,
  savePartner,
  saveStepStatus,
  setLlpId,
  setfileId
} from './llpSlice';
import { API_PATHS } from '../../apiPaths';


export const fetchMyLlps = createAsyncThunk(
  'llp/fetchMyLlps',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.get(API_PATHS.LLP.MY_LLPS);
      const llpResponse = res.data?.[0];

      /* ===================================================
         🔥 STEP VALIDATION FIX — RESET WHEN NO LLP
      =================================================== */
      if (!llpResponse) {
        dispatch(clearLlpId());
        dispatch(replacePartners([]));
        dispatch(saveNameFinalization({
          companyName: '',
          alternateName1: '',
          alternateName2: '',
          alternateName3: '',
          object: ''
        }));
        dispatch(saveLlpInfo(undefined as any)); // or explicit empty object
        dispatch(saveStepStatus({
          nameFinalization: false,
          partners: false,
          llpInfo: false,
          esign: false
        }));
        return;
      }

      const { llpData, partners, stepStatus } = llpResponse;

      

      /* ---------------- LLP ID ---------------- */
      dispatch(setLlpId(llpData.id));
      dispatch(setfileId(llpData.fileId));

      /* ---------------- STEP STATUS ---------------- */
      if (stepStatus) {
        dispatch(saveStepStatus(stepStatus));
      }

      /* ---------------- NAME FINALIZATION ---------------- */
      dispatch(
        saveNameFinalization({
          companyName: llpData.companyName ?? '',
          alternateName1: llpData.nameOption1 ?? '',
          alternateName2: llpData.nameOption2 ?? '',
          alternateName3: llpData.nameOption3 ?? '',
          object: llpData.object ?? ''
        })
      );

      /* ---------------- PARTNERS ---------------- */
      const formattedPartners: Partner[] = partners.map((p: any) => ({
        id: String(p.id),
        name: p.name ?? '',
        mobile: p.mobile ?? '',
        email: p.email ?? '',
        occupation: p.occupation ?? '',
        education: p.education ?? '',
        capital: p.contributedAmount ?? '',
        placeOfBirth: p.placeOfBirth ?? '',
        ratio: p.partnerRatio ?? '',
        dsc: p.dscAvailable ? 'yes' : 'no',
        din: p.dinAvailable ? 'yes' : 'no',
        dinNumber: p.dinNumber ?? '',
        files: {
          picture: p.files.picture ?? null,
          identityProof: p.files.identityProof ?? null,
          residentialProof: p.files.residentialProof ?? null,
          panCard: p.files.panCard ?? null
        },
        esignDocuments: p.esignDocuments ?? {}
      }));

      dispatch(replacePartners(formattedPartners));

      /* ---------------- LLP INFO ---------------- */
      dispatch(
        saveLlpInfo({
          email: llpData.llpEmail ?? '',
          mobileNumber1: llpData.llpMobile1 ?? '',
          mobileNumber2: llpData.llpMobile2 ?? '',
          address: llpData.registeredOfficeAddress ?? '',
          durationOfStay: llpData.stayDurationYears?.toString() ?? '',
          residentialProofUrl: llpData.residentialProofUrl ?? undefined,
          nocUrl: llpData.nocUrl ?? undefined,
          subscriberSheetUrl: llpData.subscriberSheet
            ? {
              fileName: llpData.subscriberSheet.fileName,
              signedUrl: llpData.subscriberSheet.signedUrl
            }
            : null
        })
      );

      return llpResponse;
    } catch (error) {
      return rejectWithValue('Failed to fetch LLP');
    }
  }
);


/* ===================== CHECK COMPANY NAME ===================== */
export const checkCompanyName = createAsyncThunk(
  'llp/checkCompanyName',
  async (companyName: string, { rejectWithValue }) => {
    try {
      const res = await api.get(API_PATHS.LLP.CHECK_NAME, { params: { companyName } });
      return res.data; // { available: boolean, message: string }
    } catch {
      return rejectWithValue('Failed to check name');
    }
  }
);

/* ===================== SUBMIT NAME FINALIZATION ===================== */
interface NameFinalizationPayload {
  companyName: string;
  object?: string;
}
export const submitNameFinalization = createAsyncThunk(
  'llp/submitNameFinalization',
  async (data: NameFinalizationPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(API_PATHS.LLP.NAME_FINALIZATION, data);
      const llpId = res.data?.llpId;
      if (!llpId) throw new Error('LLP ID not returned');

      dispatch(setLlpId(llpId));
      dispatch(saveNameFinalization(data));

      // 🔥 FIX: Update Step Status
      dispatch(saveStepStatus({
        nameFinalization: true,
        partners: false,
        llpInfo: false,
        esign: false
      }));

      return llpId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? 'Failed to finalize company name'
        );
      }

      return rejectWithValue('Failed to finalize company name');
    }
  }
);

// export const submitPartners = createAsyncThunk<
//   Partner[],
//   { llpId: string; partners: Partner[] },
//   { state: RootState }
// >(
//   'llp/submitPartners',
//   async ({ llpId, partners }, { dispatch, getState, rejectWithValue }) => {
//     try {
//       const formData = new FormData();

//       const partnersPayload = partners.map((p) => ({
//         id: p.id,
//         name: p.name,
//         mobileNumber: p.mobile,
//         emailId: p.email,
//         occupation: p.occupation,
//         education: p.education,
//         contributedCapital: p.capital,
//         placeOfBirth: p.placeOfBirth,
//         partnerRatio: p.ratio,
//         dscAvailable: p.dsc === 'yes',
//         dinAvailable: p.din === 'yes',
//         // 🔥 THIS IS THE MISSING PIECE
//         removePicture: p.files.removePicture === true,
//         removeIdentityProof: p.files.removeIdentityProof === true,
//         removeResidentialProof: p.files.removeResidentialProof === true,
//         removePanCard: p.files.removePanCard === true,
//       }));

//       formData.append('partners', JSON.stringify(partnersPayload));

//       partners.forEach((p, index) => {
//         if (p.files.picture instanceof File)
//           formData.append(`picture_${index}`, p.files.picture);
//         if (p.files.identityProof instanceof File)
//           formData.append(`identityProof_${index}`, p.files.identityProof);
//         if (p.files.residentialProof instanceof File)
//           formData.append(
//             `residentialProof_${index}`,
//             p.files.residentialProof
//           );
//         if (p.files.panCard instanceof File)
//           formData.append(`panCard_${index}`, p.files.panCard);
//       });

//       const res = await api.post(
//         `/llp/create/partners?llpId=${llpId}`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );



//       dispatch(
//         replacePartners(
//           res.data.partners.map((p: any) => ({
//             ...p,
//             files: {
//               picture: p.files?.picture ?? null,
//               identityProof: p.files?.identityProof ?? null,
//               residentialProof: p.files?.residentialProof ?? null,
//               panCard: p.files?.panCard ?? null,

//               // 🔥 RESET FLAGS AFTER SAVE
//               removePicture: false,
//               removeIdentityProof: false,
//               removeResidentialProof: false,
//               removePanCard: false,
//             }
//           }))
//         )
//       );


//       const backendPartners: Partner[] = res.data.partners.map((p: any) => ({
//         id: String(p.id),
//         name: p.name,
//         mobile: p.mobile,
//         email: p.email,
//         occupation: p.occupation,
//         education: p.education,
//         capital: p.contributedAmount,
//         placeOfBirth: p.placeOfBirth,
//         ratio: p.partnerRatio,
//         dsc: p.dscAvailable ? 'yes' : 'no',
//         din: p.dinAvailable ? 'yes' : 'no',
//         files: {
//           picture: p.files?.picture ?? null,
//           identityProof: p.files?.identityProof ?? null,
//           residentialProof: p.files?.residentialProof ?? null,
//           panCard: p.files?.panCard ?? null
//         }
//       }));

//       const currentPartners = getState().llpReducer.partners;

//       const mergedPartners = backendPartners.map((updated) => {
//         const existing = currentPartners.find((p) => p.id === updated.id);
//         if (!existing) return updated;

//         return {
//           ...updated,

//           files: {
//             picture: updated.files.picture ?? existing.files.picture,
//             identityProof:
//               updated.files.identityProof ?? existing.files.identityProof,
//             residentialProof:
//               updated.files.residentialProof ?? existing.files.residentialProof,
//             panCard: updated.files.panCard ?? existing.files.panCard
//           },

//           esignDocuments: existing.esignDocuments
//         };
//       });
//       return mergedPartners;
//     } catch {
//       return rejectWithValue('Failed to save partners');
//     }
//   }
// );


export const submitPartners = createAsyncThunk<
  Partner[],
  { llpId: string; partners: Partner[] },
  { state: RootState }
>(
  'llp/submitPartners',
  async ({ llpId, partners: formPartners }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();

      const partnersPayload = formPartners.map((p) => ({
        id: p.id,
        deleted: p.deleted === true,
        name: p.name,
        mobileNumber: p.mobile,
        emailId: p.email,
        occupation: p.occupation,
        education: p.education,
        contributedCapital: p.capital,
        placeOfBirth: p.placeOfBirth,
        partnerRatio: p.ratio,
        dscAvailable: p.dsc === 'yes',
        dinAvailable: p.din === 'yes',
        dinNumber: p.din === 'yes' ? (p.dinNumber ?? '') : '',
        removePicture: p.files.removePicture === true,
        removeIdentityProof: p.files.removeIdentityProof === true,
        removeResidentialProof: p.files.removeResidentialProof === true,
        removePanCard: p.files.removePanCard === true,
      }));

      formData.append('partners', JSON.stringify(partnersPayload));

      formPartners.forEach((p, index) => {
        if (p.files.picture instanceof File)
          formData.append(`picture_${index}`, p.files.picture);
        if (p.files.identityProof instanceof File)
          formData.append(`identityProof_${index}`, p.files.identityProof);
        if (p.files.residentialProof instanceof File)
          formData.append(`residentialProof_${index}`, p.files.residentialProof);
        if (p.files.panCard instanceof File)
          formData.append(`panCard_${index}`, p.files.panCard);
      });


      const res = await api.post(
        `${API_PATHS.LLP.SAVE_PARTNERS}?llpId=${llpId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // 🔥 FIX: Update Step Status
      dispatch(saveStepStatus({
        nameFinalization: true,
        partners: true,
        llpInfo: false,
        esign: false
      }));

      return res.data.partners.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        mobile: p.mobile,
        email: p.email,
        occupation: p.occupation,
        education: p.education,
        capital: p.contributedAmount,
        placeOfBirth: p.placeOfBirth,
        ratio: p.partnerRatio,
        dsc: p.dscAvailable ? 'yes' : 'no',
        din: p.dinAvailable ? 'yes' : 'no',
        dinNumber: p.dinNumber ?? '',
        files: {
          picture: p.files?.picture ?? null,
          identityProof: p.files?.identityProof ?? null,
          residentialProof: p.files?.residentialProof ?? null,
          panCard: p.files?.panCard ?? null,
        },
      }));
    } catch {
      return rejectWithValue('Failed to save partners');
    }
  }
);


/* ===================== SUBMIT LLP INFO ===================== */
interface SubmitLlpInfoPayload {
  llpId: string;
  form: {
    email: string;
    mobileNumber1: string;
    mobileNumber2?: string;
    address: string;
    durationOfStay: string;
    residentialProof?: File;
    noc?: File;
    removeResidentialProof?: boolean;
    removeNoc?: boolean;
  };
}

export const submitLlpInfo = createAsyncThunk(
  'llp/submitLlpInfo',
  async (
    { llpId, form }: SubmitLlpInfoPayload,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('mobileNumber1', form.mobileNumber1);
      if (form.mobileNumber2)
        formData.append('mobileNumber2', form.mobileNumber2);
      formData.append('address', form.address);
      formData.append('durationOfStay', form.durationOfStay);

      // if (form.residentialProof instanceof File)
      //   formData.append('residentialProof', form.residentialProof);
      if (form.residentialProof instanceof File) {
        formData.append('residentialProof', form.residentialProof);
      }

      if (form.removeResidentialProof) {
        formData.append('removeResidentialProof', 'true');
      }

      if (form.removeNoc) {
        formData.append('removeNoc', 'true');
      }

      if (form.noc instanceof File) formData.append('noc', form.noc);

      const res = await api.post(`${API_PATHS.LLP.UPDATE_LLP}?llpId=${llpId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;

      dispatch(
        saveLlpInfo({
          email: data.email ?? form.email,
          mobileNumber1: data.mobileNumber1 ?? form.mobileNumber1,
          mobileNumber2: data.mobileNumber2 ?? form.mobileNumber2,
          address: data.address ?? form.address,
          durationOfStay: data.durationOfStay ?? form.durationOfStay,

          // ✅ update file URLs ONLY if backend returned them
          ...(data?.uploadedFiles?.residentialProof && {
            residentialProofUrl: data.uploadedFiles.residentialProof
          }),

          ...(data?.uploadedFiles?.noc && {
            nocUrl: data.uploadedFiles.noc
          }),
          // 🔥 CLEAR FILES IF REMOVED
          ...(form.removeResidentialProof && {
            residentialProofUrl: null
          }),
          ...(form.removeNoc && {
            nocUrl: null
          })

        })
      );

      // 🔥 FIX: Update Step Status immediately
      dispatch(saveStepStatus({
        nameFinalization: true,
        partners: true,
        llpInfo: true,
        esign: false // Next step
      }));

      // Always return the backend URLs for component to use
      return {
        residentialProofUrl: data.residentialProofUrl ?? null,
        nocUrl: data.nocUrl ?? null
      };
    } catch (error) {
      return rejectWithValue('Failed to save LLP information');
    }
  }
);

/* ===================== SUBMIT LLP eSIGN ===================== */
/* ===================== SUBMIT LLP eSIGN ===================== */

export interface SubmitEsignPayload {
  llpId: string;
  subscriberSheet?: File;
  partnerFiles: Record<string, File>;
}

export interface SubmitEsignResponse {
  subscriberSheetUrl?: {
    fileName: string;
    signedUrl: string;
  };
  partnerFilesUrls?: Record<
    string,
    {
      fileName: string;
      signedUrl: string;
    }
  >;
}

export const submitLlpEsign = createAsyncThunk<
  SubmitEsignResponse,
  SubmitEsignPayload,
  { state: RootState }
>(
  'llp/submitLlpEsign',
  async ({ llpId, subscriberSheet, partnerFiles }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();

      if (subscriberSheet instanceof File) {
        formData.append('subscriberSheet', subscriberSheet);
      }

      const metadata: Record<string, { partnerId: string; type: 'form9' }> = {};
      let index = 0;

      Object.entries(partnerFiles).forEach(([partnerId, file]) => {
        if (!(file instanceof File)) return;
        formData.append('form9', file);
        metadata[`form9_${index}`] = { partnerId, type: 'form9' };
        index++;
      });

      if (Object.keys(metadata).length > 0) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      /* ✅ ALWAYS call backend */
      const res = await api.post(API_PATHS.LLP.ESIGN(llpId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const payload = res.data;

      /* ✅ NORMALIZE backend response */

      // 🔥 FIX: Update Step Status immediately
      dispatch(saveStepStatus({
        nameFinalization: true, // Assuming previous steps are done if we are here
        partners: true,
        llpInfo: true,
        esign: true
      }));

      return {
        subscriberSheetUrl: payload.llpData?.subscriberSheet ?? null,

        partnerFilesUrls: payload.partners
          ? Object.fromEntries(
            payload.partners
              .filter((p: any) => p.id && p.esignDocuments?.form9)
              .map((p: any) => [
                p.id,
                {
                  fileName: p.esignDocuments.form9.fileName,
                  signedUrl: p.esignDocuments.form9.signedUrl
                }
              ])
          )
          : {}
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || 'Failed to upload eSign documents'
      );
    }
  }
);
