import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';
import { RootState } from '..';

interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk(
  'document/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/documents');
      return response.data.data.documents;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'document/uploadDocument',
  async ({ formData, metadata }: { formData: FormData; metadata: Partial<Document> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const documentData = {
        ...response.data.data.document,
        ...metadata,
      };

      return documentData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'document/deleteDocument',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/documents/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setSelectedDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Documents
    builder.addCase(fetchDocuments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDocuments.fulfilled, (state, action) => {
      state.loading = false;
      state.documents = action.payload;
    });
    builder.addCase(fetchDocuments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Upload Document
    builder.addCase(uploadDocument.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadDocument.fulfilled, (state, action) => {
      state.loading = false;
      state.documents.push(action.payload);
    });
    builder.addCase(uploadDocument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Document
    builder.addCase(deleteDocument.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDocument.fulfilled, (state, action) => {
      state.loading = false;
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    });
    builder.addCase(deleteDocument.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedDocument, clearError } = documentSlice.actions;
export default documentSlice.reducer; 