import { Schema, InferSchemaType, model } from "mongoose";
import { Password } from "../utils/passwrod";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
} , {
  toJSON : {
    transform( doc , ret ){
      const { _id , password , __v , ...rest } = ret;
      return { id : _id , ...rest };
    }
  }
});

userSchema.pre( 'save' , async function () {
  if(!this.isModified('password')) return;
  this.password = await Password.toHash(this.password);
});

export const UserModel = model("User", userSchema);
