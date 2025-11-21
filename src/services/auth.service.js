import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class AuthService {
    static async register(email, password, name){

        console.log(email, name, password)
        const user = await UserRepository.getByEmail(email)
        
        if(user){
            throw new ServerError(400, 'Email ya en uso')
        }
    
        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.create(name, email, password_hashed)
        const user_id_created = user_created._id

        //CREAMOS UN JSON WEB TOKEN
        //Un JSON web token es un objeto pasado a texto con una firma (SIGNATURE)
        //Vamos a enviar entre JWT por URL 

        //.sing() firmar un token
        const verification_token = jwt.sign(
            {
                user_id: user_id_created
            },
            ENVIRONMENT.JWT_SECRET
        )

        await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta de mail',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: 'Arial', sans-serif; 
                        background-color: #f6f9fc; 
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background: #ffffff; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                        overflow: hidden; 
                    }
                    .header { 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        padding: 40px 30px; 
                        text-align: center; 
                        color: white; 
                    }
                    .content { 
                        padding: 40px 30px; 
                        color: #333; 
                        line-height: 1.6; 
                    }
                    .button { 
                        display: inline-block; 
                        padding: 14px 35px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        margin: 25px 0; 
                        transition: transform 0.2s, box-shadow 0.2s; 
                    }
                    .button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                    }
                    .footer { 
                        background: #f8f9fa; 
                        padding: 25px; 
                        text-align: center; 
                        color: #666; 
                        font-size: 13px; 
                        border-top: 1px solid #eaeaea;
                    }
                    .title {
                        color: #2d3748;
                        margin-bottom: 20px;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .text {
                        color: #4a5568;
                        margin-bottom: 25px;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 32px;">🔐 Verifica tu cuenta</h1>
                    </div>
                    
                    <div class="content">
                        <h2 class="title">¡Ya casi estás listo!</h2>
                        <p class="text">
                            Para completar tu registro y comenzar a usar nuestra plataforma, 
                            por favor verifica tu dirección de email haciendo clic en el siguiente botón:
                        </p>
                        
                        <div style="text-align: center;">
                            <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email/${verification_token}" 
                            class="button">
                                Verificar Mi Cuenta
                            </a>
                        </div>
                        
                        <p class="text" style="color: #718096; font-size: 14px;">
                            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                            <span style="color: #667eea; word-break: break-all;">
                                ${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email/${verification_token}
                            </span>
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p style="margin: 0 0 10px 0;">
                            Si no solicitaste esta verificación, por favor ignora este mensaje.
                        </p>
                        <p style="margin: 0; color: #a0aec0;">
                            &copy; 2024 Tu Empresa. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
        });

        return
    }

    static async verifyEmail (verification_token){
        try{
            //Nos dice si el token esta firmado con x clave
            const payload = jwt.verify(
                verification_token, 
                ENVIRONMENT.JWT_SECRET
            )
            const {user_id} = payload
            if(!user_id){
                throw new ServerError(400, 'Accion denegada, token con datos insuficientes')
            } 

            const user_found = await UserRepository.getById(user_id)
            if(!user_found){
                throw new ServerError(404, 'Usuario no encontrado')
            }

            if(user_found.verified_email){
                throw new ServerError(400, 'Usuario ya validado')
            }

            await UserRepository.updateById(user_id, {verified_email: true})

            return 
        }
        catch(error){
            //Checkeamos si el error es de la verificacion del token
            if(error instanceof jwt.JsonWebTokenError){
                throw new ServerError(400, 'Accion denegada, token invalido')
            }
            throw error
        }
    }

    static async login (email, password){
        /* 
        -Buscar al usuario por email
        -Validar que exista
        -Validar que este verificado su mail
        -Comparar la password recibida con la del usuario
        -Genera un token con datos de sesion del usuario y responderlo
        */

        const user_found = await UserRepository.getByEmail(email)
        
        if(!user_found) {
            throw new ServerError(404, 'Usuario con este mail no encontrado')
        }
        
        if(!user_found.verified_email){
            throw new ServerError(401, 'Usuario con mail no verificado')
        }

        const is_same_passoword = await bcrypt.compare( password, user_found.password )
        if(!is_same_passoword){
            throw new ServerError(401, 'Contraseña invalida')
        }

        //creo un token con datos de sesion (DATOS NO SENSIBLES)
        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found._id,
            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        )

        return {
            auth_token: auth_token
        }
    }
}

export default AuthService

/* 
AUTOMATIZACION DE GENERADOR DE CLAVES PARA JWT

Creo esta tabla o coleccion
- type: "AUTH" | "PRODUCTS" | "SESSIONS"
- id : INT | STRING
- secret : STRING
- expire_in : DATE
- created_at: DATE
- active: boolean

PARA CREAR: 
    Cada vez que creemos el token usamos el ultimo registro de la tabla
    Si el registro esta expirado crear uno nuevo
    y guardamos en el token el secret_id (el id de esa clave)

PARA USAR/VERIFICAR: 
    Vas a tomar el secret_id y vas a buscar el la DB si existe un secreto con ese secret_id, en caso de existir vas a verificar el token con ese secret
*/