
Discord Clone es una aplicación web de mensajería que replica las funcionalidades principales de Discord. Permite a los usuarios crear workspaces, canales de comunicación y enviar mensajes.

#### - Tecnologías Utilizadas
    Backend: Node.js, Express.js, MongoDB, Mongoose.
    Autenticación: JWT (JSON Web Token).
    Email: Nodemailer para verificación e invitaciones.

#### - Endpoints

    Authentication Endpoints
    - POST /api/auth/login
        Te permite loguearte en la aplicación.
        Body:`{ email, password }`
        Response:`{ status: 200, ok: true, data: { auth_token } }`

    - POST /api/auth/register
        Registra un nuevo usuario en la aplicación.
        Body: `{ name, email, password }`
        Response: `{ status: 201, ok: true, message: "Usuario registrado. Verifica tu email." }`

    - GET /api/auth/verify-email/:verification_token
        Verifica la cuenta de email desde el link enviado.
        Response: Redirecciona al frontend

---

    Workspace Endpoints
        - GET /api/workspace/
            Obtiene todos los workspaces del usuario autenticado.
            Headers: `Authorization: Bearer <token>`
            Response:`{ status: 200, ok: true, data: { workspaces } }`

        - POST /api/workspace/
            Crea un nuevo workspace.
            Headers: `Authorization: Bearer <token>`
            Body: `{ name, url_image }`
            Response: `{ status: 201, ok: true, data: { workspace_created } }`

        - PUT /api/workspace/:workspace_id 
            Actualiza un workspace existente.
            Headers: Authorization: Bearer <token>
            Body: { name, url_image }

Response: { status: 200, ok: true, data: { workspace_updated } }

        - DELETE /api/workspace/:workspace_id
            Elimina un workspace (solo admin).
            Headers: `Authorization: Bearer <token>`
            Response: `{ status: 200, ok: true, message: "Espacio de trabajo eliminado correctamente" }`

        - GET /api/workspace/:workspace_id/channels
            Obtiene los detalles de un workspace y sus canales.
            Headers: `Authorization: Bearer <token>`
            Response: `{ status: 200, ok: true, data: { workspace_detail, channels } }`

        - POST /api/workspace/:workspace_id/invite
            Invita a un usuario al workspace por email.
            Headers: `Authorization: Bearer <token>`
            Body: `{ email_invited, role_invited }`
            Response: `{ status: 200, ok: true, message: "Invitación enviada" }`

        - GET /api/workspace/:workspace_id/current-member
            Obtiene el member_id del usuario actual en el workspace.
            Headers: `Authorization: Bearer <token>`
            Response: `{ status: 200, ok: true, data: { member_id, role, user_id } }`

---

    Channel Endpoints
        - POST /api/workspace/:workspace_id/channels
            Crea un nuevo canal en el workspace (solo admin).
            Headers: `Authorization: Bearer <token>`
            Body: `{ name }`
            Response: `{ status: 201, ok: true, data: { channel_created } }`

        - DELETE /api/workspace/:workspace_id/channels/:channel_id
            Elimina un canal del workspace.
            Headers: `Authorization: Bearer <token>`
            Response: `{ status: 200, ok: true, message: "Canal eliminado correctamente" }`

---

    Messages Endpoints
        - GET /api/workspace/:workspace_id/channels/:channel_id/messages
            Obtiene todos los mensajes de un canal.
            Headers: `Authorization: Bearer <token>`
            Response: `{ status: 200, ok: true, data: { messages } }`

        - POST /api/workspace/:workspace_id/channels/:channel_id/messages
            Envía un mensaje en un canal.
            Headers: `Authorization: Bearer <token>`
            Body: `{ message_content }`
            Response: `{ status: 201, ok: true, data: { message_created } }`

---

    Member Endpoints
        - GET /api/member/confirm/:invitation_token
        Confirma una invitación a workspace desde el email.
        Response: Redirecciona al frontend

---

