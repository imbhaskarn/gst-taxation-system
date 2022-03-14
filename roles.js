const isBasic = (req, res, next) => {
    if (!req.payload) {
        return res.json({
            msg: "Please login first!"
        })
    }
    if (req.payload.role !== 'basic') {
        return res.json({
            msg: "Permissin not granted!"
        })
    }
    return next()
}
const isAccountant = (req, res, next) => {
    if (!req.payload) {
        return res.json({
            msg: "Please login first!"
        })
    }
    if (req.payload.role !== 'accountant') {
        return res.json({
            msg: "Permissin not granted!"
        })
    }
    return next()
}

const isAdmin = (req, res, next) => {
    if (!req.payload) {
        return res.json({
            msg: "Please login first!"
        })
    }
  
    if (req.payload.role !== 'admin') {
        return res.json({
            msg: "Permissin not granted!"
        })
    }
    return next()
}

const isAdminOrAccountant = (req, res, next) => {
    if (!req.payload) {
        return res.json({
            msg: "Please login first!"
        })
    }
    if (req.payload.role === 'basic') {
        return res.json({
            msg: "Permissin not granted!"
        })
    }

    return next()
}

module.exports = {
    isBasic,
    isAdmin,
    isAccountant,
    isAdminOrAccountant
}