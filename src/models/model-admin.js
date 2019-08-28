const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    { Schema } = mongoose;
// Modelo de BD de los administradores
const AdminSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});
// Cambiar contraseña
AdminSchema.pre('save', function(next) {
    let user = this;
    //checks if password is changed, else no need to do anything
    if (!user.isModified('password')) {
        return next();
    }
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    next();
});
// Cifrar Contraseña
AdminSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
// Match con Password Almacenado
AdminSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
