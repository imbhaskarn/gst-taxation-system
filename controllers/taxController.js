const res = require('express/lib/response')
const {
    default: mongoose
} = require('mongoose')
const TaxReturn = require('../models/taxReturnModel')
const User = require('../models/userModel')



function taxCal(amount) {
    let tax = amount * 12 / 100
    return tax
}
// count days passed after duedate
function daysAfterDue(dueDate) {
    let duedate = Date.parse(dueDate)
    let currentDate = Date.now()
    if (currentDate > duedate) {
        let days = Math.floor((currentDate - dueDate) / 86400000)
        return days
    }
    return 0
}
const createOne = async (req, res) => {
    try {
        const body = req.body
        if (!body) {
            return res.json({
                msg: "invalid input"
            })
        }
        let codeArr = [35, 04, 36, 38, 97]

        var taxname = (codeArr.indexOf(body.statecode) < 0) ? "sgst" : "utgst"

        let newTaxReturn = new TaxReturn({
            userId: req.payload.id,
            taxPayerName: body.name,
            company: {
                Name: body.companyname
            },
            stateCode: body.statecode,
            totalTax: taxCal(body.netsale),
            cgst: taxCal(body.netsale) / 2,
            stateTax: {
                taxName: taxname,
                amount: taxCal(body.netsale) / 2
            },
            incomeTax: {
                incomeFromSalary: body.salaryincome,
                incomeFromShareMarket: body.sharemarketincome,
            },
        })

        const newSaved = await newTaxReturn.save()
        return res.json(JSON.stringify(newSaved))
    } catch (err) {
        if (err) {
            return res.json({
                msg: err.msg
            })
        }
    }
}

const viewAll = async (req, res) => {
    try {
        if (req.payload.role === 'basic') {
            const result = await TaxReturn.find({
                userId: req.payload.id
            })
            return res.json(JSON.stringify(result))
        }

        const result = await TaxReturn.find({})
        return res.json(result)
    } catch (err) {
        if (err) {
            res.json({
                msg: err.message
            })
        }
    }
}

const viewOne = async (req, res) => {
    try {
        let id = req.params.id
        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            throw new Error("invalid object id")
        }
        const result = await TaxReturn.findOne({
            _id: id
        })
        if (!result) {
            return res.json({
                msg: `records not found with id:${id}`
            })
        }
        if (req.payload.role === "basic") {
            const record = result.userId === req.payload.id ? result : "Permission not granted"
            return res.json(record)
        }
        return res.json(result)
    } catch (err) {
        if (err) {
            console.log(err)
            res.json({
                msg: err.message
            })
        }
    }
}
const reviewOne = async (req, res) => {

    try {
        let id = req.params.id
        let isValid = mongoose.Types.ObjectId.isValid(id);

        if (!isValid) {
            throw new Error("invalid object id")
        }
        const result = await TaxReturn.findOne({
            _id: id
        })
        console.log(result.isPaid)
        if (result.isPaid) {
            return res.json({
                msg: "paid tax cannot be reviewed"
            })
        }
        let updatedDoc = {
            company: {
                panNo: req.body.pan,
                gstNo: req.body.gstno,
            },
            totalIncomeTax: req.body.totalincometax,
            isReviewed: true,
        }

        const updateResult = await TaxReturn.findOneAndUpdate({
            _id: id
        }, updatedDoc, {
            new: true
        })
        return res.json(updateResult)
    } catch (err) {
        if (err) {
            res.json({
                msg: err.message
            })
        }
    }
}

const payReturn = async (req, res) => {
    try {
        let id = req.params.id
        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            throw new Error("invalid object id")
        }
        let result = await TaxReturn.findById({
            _id: id
        })
        if (!result) {
            return res.json({
                msg: `record with id:${id} doesn't exist`
            })
        }
        if (!result.isReviewed) {
            return res.json({
                msg: `Tax return is pending review by accountant`
            })
        }
        if (result.isPaid) {
            return res.json({
                msg: `Tax return with id:${id} is paid already`
            })
        }

        let penalty, intrest = 0
        let days = daysAfterDue(result.dueDate)
        console.log(days)
        if (daysAfterDue(result.dueDate) > 0) {
            penalty = days * 100
            intrest = days * (result.totalTax * 18 / 365 * 100)
        }
        let payUpdate =
            await TaxReturn.findOneAndUpdate({
                _id: id
            }, {
                fines: {
                    intrest,
                    penalty
                },
                isPaid: true
            }, {
                new: true
            })

        return res.json(JSON.stringify(payUpdate))
    } catch (err) {
        if (err) {
            return res.json({
                msg: err.message
            })
        }
    }

}

const createDue = async (req, res) => {
    try {
        let id = req.body.id
        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            throw new Error("invalid object id")
        }
        let date = req.body.duedate
        let result = await TaxReturn.find({
            _id: id
        })
        if (result.isPaid) {
            return res.json({
                msg: `Tax return with id:${id} is paid already`
            })
        }
        if (!id && !date) {
            return res.json({
                msg: "empty body object"
            })
        }
        const updatedDoc = await TaxReturn.findOneAndUpdate({
            id
        }, {
            dueDate: date
        }, {
            new: true
        })
        return res.json(updatedDoc)
    } catch (err) {
        if (err) {
            return res.json({
                msg: err.message
            })
        }
    }
}
const deleteReturn = async (req, res) => {
    try {
        let id = req.params.id
        let isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            throw new Error("invalid object id")
        }
        let status = await User.findByIdAndDelete({
            _id: id
        })
        if (!status) {
            return res.json({
                msg: `record does not Exists wit id:${id}`
            })
        }
        res.json({
            msg: "record deleted successfully"
        })
    } catch (err) {
        res.json({
            msg: err.message
        })
    }
}


module.exports = {
    viewAll,
    createOne,
    reviewOne,
    viewOne,
    payReturn,
    deleteReturn,
    createDue
}