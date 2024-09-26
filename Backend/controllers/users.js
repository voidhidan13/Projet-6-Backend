const bcrypt = require('bcrypt');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');

//S'INSCRIRE

exports.signup = (req,res,next) => {
    //hachage 
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new Users ({
            email: req.body.email,
            password : hash
        });
    // Sauvegarde de l'user bdd
        user.save()
        .then(() => res.status(200).json({ message:'Utilisateur crée !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));

};

// SE CONNECTER

exports.login = (req, res, next) => {
    // Trouver l'utilisateur par email
    Users.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé !' });
            }

            // Comparer le mot de passe envoyé avec celui dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' });
                    }

                    // Si la comparaison est réussie, générer un token JWT
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET, // Clé secrète du JWT (définie dans ton fichier .env)
                        { expiresIn: '24h' } // Durée de validité du token
                    );

                    // Répondre avec le token et l'id utilisateur
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

 

//Mot de passe oublié


exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;

    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 heure

            user.save()
                .then(() => {
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'your-email@gmail.com',
                            pass: 'your-email-password'
                        }
                    });

                    const mailOptions = {
                        to: user.email,
                        from: 'passwordreset@example.com',
                        subject: 'Réinitialisation du mot de passe',
                        text: `Vous avez demandé la réinitialisation du mot de passe pour votre compte.\n\n` +
                              `Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n\n` +
                              `http://${req.headers.host}/reset/${token}\n\n` +
                              `Si vous n'avez pas demandé cela, ignorez cet e-mail et aucun changement ne sera effectué.\n`
                    };

                    transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail' });
                        }
                        res.status(200).json({ message: 'Un e-mail a été envoyé avec des instructions pour réinitialiser le mot de passe.' });
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};