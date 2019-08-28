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
//-- function that enters before the Schema is saved
AdminSchema.pre('save', function(next) {
    // Uses this to reference the Schema, it should not be an arrow function
    //-- isModified('parameter') is to detect if some parameter from the Schema is being changed
    if (this.isModified('password')) {
        console.log('se modifica');
        // Does the password HASH
        this.password = bcrypt.hashSync(
            this.password,
            bcrypt.genSaltSync(10),
            null
        );
        next();
    } else {
        return next();
    }
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
