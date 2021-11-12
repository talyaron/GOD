import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store';
import { uploadFile } from '../../controlers/assets';
import { activateQuestion,getAllQuestions } from '../../controlers/questions/questions';
import { Image } from '../../model/image'

export interface ActiveQuestionObject{
  isActive:boolean;
  questionId:string;
}

//thunk for upload image
export const uploadFileThunk = createAsyncThunk(
  'newQuestion/uploadQuestion',
  async (file: File, thunkAPI) => {
    console.log(file);
    const fileData = await uploadFile(file);
    return fileData;
  }
)


//thunk for activate question
export const activateQuestionThunk = createAsyncThunk(
  'newQuestion/activateQuestion',
  async (isActivateObj:ActiveQuestionObject, thunkAPI) => {
    const {isActive, questionId} = isActivateObj;
    const isActivateDB = await activateQuestion(isActive, questionId);
    return isActivateDB;
  }
)

export const getQuestionsThunk = createAsyncThunk(
  'newQuestion/getQuestions',
  async(thunkAPI)=>{
    const questions = await getAllQuestions();
    return questions
  }
)

// Define a type for the slice state
export interface QuestionSchema {
  questionId: string | boolean;
  value: number,
  title: string,
  image: Image,
  status: string,
  description: string,
  loader: boolean,
  enableMoveTo2: boolean,
  enableMoveTo3: boolean,
  activate: boolean,
  questionsLoder:boolean,
  questions:[]
}

// Define the initial state using that type
const initialState = {
  questionId: false,
  value: 1,
  title: '',
  description: '',
  image: {},
  status: '',
  loader: false,
  enableMoveTo2: false,
  enableMoveTo3: false,
  activate: false,
  questionsLoder:false,
  questions:[]
} as QuestionSchema;

export const counterSlice = createSlice({
  name: 'newQuestion',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {

      if (state.value < 4) state.value += 1;
    },
    decrement: (state) => {
      if (state.value > 1) state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    setQuestionId: (state, action: PayloadAction<string>) => {
      state.questionId = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setEnableMoveTo2: (state, action) => {
      state.enableMoveTo2 = action.payload;
    },
    setEnableMoveTo3: (state, action) => {
      state.enableMoveTo3 = action.payload;
    },
    setActivate: (state, action) => {
      console.log(action)
      state.activate = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(uploadFileThunk.pending, (state: any, action: any) => {
        state.status = 'pending';
        state.loader = true;
      })
      .addCase(uploadFileThunk.fulfilled, (state: any, action: any) => {
        state.image = JSON.parse(action.payload);
        state.status = 'success';
        state.loader = false;
      })
      .addCase(uploadFileThunk.rejected, (state: any, action: any) => {
        state.image = action.payload;
        state.status = 'failed';
        state.loader = false;
      })
      .addCase(activateQuestionThunk.pending, (state:any, action:any)=>{
        state.status = 'pending';
        state.loader = true;
      })
      .addCase(activateQuestionThunk.fulfilled, (state: any, action: any) => {
        state.image = JSON.parse(action.payload);
        state.status = 'success';
        state.loader = false;
      })
      .addCase(activateQuestionThunk.rejected, (state: any, action: any) => {
        state.image = action.payload;
        state.status = 'failed';
        state.loader = false;
      })
      .addCase(getQuestionsThunk.pending, (state:any, action:any)=>{
        state.loadingQuestions = true;
      })
      .addCase(getQuestionsThunk.fulfilled, (state:any, action:any)=>{
        state.questions = action.payload;
        state.loadingQuestions = false;
      })
      .addCase(getQuestionsThunk.rejected, (state:any, action:any)=>{
        state.loadingQuestions = false;
        state.error = action.payload;
      })
  }
})

export const { increment, decrement, incrementByAmount, setQuestionId, setTitle, setDescription, setEnableMoveTo2, setEnableMoveTo3, setActivate } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectQuestion = (state: RootState) => state.counter
export const selectCount = (state: RootState) => state.counter.value;
export const selectTitle = (state: RootState) => state.counter.title;
export const selectDescription = (state: RootState) => state.counter.description;
export const selectLoader = (state: RootState) => state.counter.loader;
export const selectImage = (state: RootState) => state.counter.image;
export const selectEnableMoveTo2 = (state: RootState) => state.counter.enableMoveTo2;
export const selectEnableMoveTo3 = (state: RootState) => state.counter.enableMoveTo3;
export const selectQuestionId = (state: RootState) => state.counter.questionId;
export const allQuestions = (state: RootState) => state.counter.questions

export default counterSlice.reducer