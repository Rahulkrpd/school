

import { model, models, Schema } from "mongoose"


export interface ISchool {
    name: string,
    address: string,
    city: string,
    contact: number,
    image: string
    email: string,

}


const SchoolSchema = new Schema({
    name: {
        type: String, require: true
    },
    address: {
        type: String, require: true
    },
    city: {
        type: String, require: true
    },
    contact: {
        type: Number, require: true
    },
    image: {
        type: String, require: true
    },
    email: {
        type: String, require: true, unique: true
    }

})

const School = models.School || model("School", SchoolSchema)

export default School