// model/DAO/eventoEstadoDAO.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const selectEventosComEstado = async () => {
    try {
        const sql = `
            SELECT 
                e.*, 
                est.id_estado AS estado_id, 
                est.estado AS estado_nome
            FROM tbl_evento AS e
            JOIN tbl_estado AS est ON e.id_estado = est.id_estado
            ORDER BY e.id_evento DESC
        `

        const result = await prisma.$queryRawUnsafe(sql)

        if (result && result.length > 0) {
            return result.map(e => ({
                id_evento: e.id_evento,
                titulo: e.titulo,
                descricao: e.descricao,
                data_evento: e.data_evento,
                horario: e.horario,
                local: e.local,
                imagem: e.imagem,
                limite_participante: e.limite_participante,
                valor_ingresso: e.valor_ingresso,
                id_usuario: e.id_usuario,
                estado: {
                    id_estado: e.estado_id,
                    estado: e.estado_nome
                }
            }))
        }

        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    selectEventosComEstado
}
