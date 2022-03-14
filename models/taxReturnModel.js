const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const taxReturnSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    taxPayerName: {
        type: String,
        required: true
    },
    company: {
        Name: {
            type: String,
            required: true
        },
        panNo: {
            type: String,
        },
        gstNo: {
            type: String,
        },
    },
    netSale: {
        type: Number,
        default: 0
    },
    totalTax: {
        type: Number,
        default: 0
    },
    cgst: {
        type: Number,
        default: 0
    },
    stateCode: {
        type: Number,
        required: true
    },
    stateTax: {
        taxName: {
            type: String,
            enum: ["sgst", "utgst"]
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    incomeTax: {
        incomeFromSalary: {
            type: Number,
        },
        incomeFromShareMarket: {
            type: Number,
        }
    },
    totalIncomeTax: {
        type: Number,
        default: 0
    },
    fines: {
        intrest: {
            type: Number,
            default: 0
        },
        penalty: {
            type: Number,
            default: 0
        }
    },
    dueDate: {
        type: Date,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isReviewed: {
        type: Boolean,
        default: false
    }
})

const TaxReturn = mongoose.model('taxReturns', taxReturnSchema)
module.exports = TaxReturn