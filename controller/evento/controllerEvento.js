const DAOevento = require('../../model/DAO/evento/eventoDAO.js')
const DAOeventoCategoria = require('../../model/DAO/evento/eventoCategoriaDAO.js')
const DAOeventoParticipante = require('../../model/DAO/evento/participarEvento.js')
const controllerEventoCategoria = require('../../controller/evento/controllerEventoCategoria.js')
const controllerUsuario = require('../../controller/usuario/controllerUsuario.js')
const controllerParticipante = require('./controllerParticiparEvento.js')
const eventoEstadoDAO = require('../../model/DAO/evento/eventoEstado.js')
const message = require('../../modulo/config.js')

const inserirEvento = async (evento, contentType) => {
    try {
        if (contentType && contentType.includes('application/json')) {
            let dados = {}
            if (
                evento.titulo == '' || evento.titulo == undefined || evento.titulo == null || evento.titulo.length > 100 ||
                evento.descricao == '' || evento.descricao == undefined || evento.descricao == null || evento.descricao.length > 60 ||
                evento.data_evento == '' || evento.data_evento == undefined || evento.data_evento == null || evento.data_evento.length > 20 ||
                evento.horario == '' || evento.horario == undefined || evento.horario == null || evento.horario.length > 15 ||
                evento.local == '' || evento.local == undefined || evento.local == null || evento.local.length > 70 ||
                evento.imagem == '' || evento.imagem == undefined || evento.imagem == null || evento.imagem.length > 500 ||
                evento.limite_participante == '' || evento.limite_participante == undefined || evento.limite_participante == null ||
                evento.valor_ingresso == '' || evento.valor_ingresso == undefined || evento.valor_ingresso == null ||
                evento.id_usuario == '' || evento.id_usuario == undefined || evento.id_usuario == null ||
                evento.id_estado == '' || evento.id_estado == undefined || evento.id_estado == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let result = await DAOevento.inserirEvento(evento)
                if (result) {
                    if (evento.categoria && Array.isArray(evento.categoria)) {
                        let eventoInserido = await DAOevento.selectLastId()
                        let idEvento = eventoInserido[0].id_evento
                        for (let categoria of evento.categoria) {
                            if (categoria.id_categoria && !isNaN(categoria.id_categoria)) {
                                let eventoCategoria = {
                                    id_evento: idEvento,
                                    id_categoria: categoria.id_categoria
                                }
                                await DAOeventoCategoria.insertEventoCategoria(eventoCategoria)
                            }
                        }
                    }
                    if (evento.participante && Array.isArray(evento.participante)) {
                        let eventoInserido = await DAOevento.selectLastId()
                        let idEvento = eventoInserido[0].id_evento
                        for (let participante of evento.participante) {
                            if (participante.id_usuario && !isNaN(participante.id_usuario)) {
                                let eventoParticipante = {
                                    id_evento: idEvento,
                                    id_usuario: participante.id_usuario
                                }
                                await DAOeventoParticipante.insertParticiparEvento(eventoParticipante)
                            }
                        }
                    }
                    let lastid = await DAOevento.selectLastId()
                    dados = {
                        status: true,
                        status_code: 200,
                        eventoID: lastid,
                        evento: evento
                    }
                    return dados
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarEvento = async (id, evento, contentType) => {
    try {
        if (contentType == 'application/json') {
            if (
                evento.titulo == '' || evento.titulo == undefined || evento.titulo == null || evento.titulo.length > 100 ||
                evento.descricao == '' || evento.descricao == undefined || evento.descricao == null || evento.descricao.length > 60 ||
                evento.data_evento == '' || evento.data_evento == undefined || evento.data_evento == null || evento.data_evento.length > 20 ||
                evento.horario == '' || evento.horario == undefined || evento.horario == null || evento.horario.length > 15 ||
                evento.local == '' || evento.local == undefined || evento.local == null || evento.local.length > 70 ||
                evento.imagem == '' || evento.imagem == undefined || evento.imagem == null || evento.imagem.length > 500 ||
                evento.limite_participante == '' || evento.limite_participante == undefined || evento.limite_participante == null ||
                evento.valor_ingresso == '' || evento.valor_ingresso == undefined || evento.valor_ingresso == null ||
                evento.id_usuario == '' || evento.id_usuario == undefined || evento.id_usuario == null ||
                evento.id_estado == '' || evento.id_estado == undefined || evento.id_estado == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            }
            let result = await DAOevento.selectEventoById(id)
            if (result && result.length > 0) {
                evento.id = parseInt(id)
                let update = await DAOevento.updateEvento(evento)
                if (update) {
                    if (evento.categoria && Array.isArray(evento.categoria)) {
                        let eventoInserido = await DAOevento.selectLastId()
                        let idEvento = eventoInserido[0].id_evento
                        for (let categoria of evento.categoria) {
                            if (categoria.id_categoria && !isNaN(categoria.id_categoria)) {
                                let eventoCategoria = {
                                    id_evento: idEvento,
                                    id_categoria: categoria.id_categoria
                                }
                                await DAOeventoCategoria.updateEventoCategoria(eventoCategoria)
                            }
                        }
                    }
                    if (evento.participante && Array.isArray(evento.participante)) {
                        let eventoInserido = await DAOevento.selectLastId()
                        let idEvento = eventoInserido[0].id_evento
                        for (let participante of evento.participante) {
                            if (participante.id_usuario && !isNaN(participante.id_usuario)) {
                                let eventoParticipante = {
                                    id_evento: idEvento,
                                    id_usuario: participante.id_usuario
                                }
                                await DAOeventoParticipante.updateParticiparEvento(eventoParticipante)
                            }
                        }
                    }
                    delete evento.id
                    return {
                        status: true,
                        status_code: 200,
                        evento: evento
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirEvento = async function (id) {
    try {
        if (id == '' || id == undefined || id == null || isNaN(id) || id <= 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let results = await DAOevento.selectEventoById(parseInt(id))
            if (results && results.length > 0) {
                let result = await DAOevento.deleteEvento(parseInt(id))
                return result ? message.SUCCESS_DELETED_ITEM : message.ERROR_INTERNAL_SERVER_MODEL
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarEvento = async function () {
    try {
        let arrayEventos = []
        let dados = {}
        let result = await eventoEstadoDAO.selectEventosComEstado()

        if (result && result.length > 0) {
            for (const itemEvento of result) {
                let dadosUsuario = await controllerParticipante.buscarUsuario(itemEvento.id_usuario)
                itemEvento.usuario = dadosUsuario.usuario
                delete itemEvento.id_usuario

                let dadosCategoria = await controllerEventoCategoria.buscarCategoriaPorEvento(itemEvento.id_evento)
                itemEvento.categoria = dadosCategoria.categoria

                let dadosParticipante = await controllerParticipante.buscarUsuarioPorEvento(itemEvento.id_evento)
                itemEvento.participante = dadosParticipante.usuario

                arrayEventos.push(itemEvento)
            }

            dados.status = true
            dados.status_code = 200
            dados.itens = arrayEventos.length
            dados.eventos = arrayEventos
            return dados
        } else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarEvento = async function (id) {
    let dados = {}
    let arrayEventos = []
    try {
        if (id == '' || id == undefined || id == null || id < 0) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let result = await DAOevento.selectEventoById(id)
            if (result && result.length > 0) {
                for (const itemEvento of result) {
                    let dadosUsuario = await controllerParticipante.buscarUsuario(itemEvento.id_usuario)
                    itemEvento.usuario = dadosUsuario.usuario
                    delete itemEvento.id_usuario

                    let dadosCategoria = await controllerEventoCategoria.buscarCategoriaPorEvento(itemEvento.id_evento)
                    itemEvento.categoria = dadosCategoria.categoria

                    let dadosParticipante = await controllerParticipante.buscarUsuarioPorEvento(itemEvento.id_evento)
                    itemEvento.participante = dadosParticipante.usuario

                    arrayEventos.push(itemEvento)
                }

                dados.status = true
                dados.status_code = 200
                dados.itens = arrayEventos.length
                dados.eventos = arrayEventos
                return dados
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirEvento,
    atualizarEvento,
    excluirEvento,
    listarEvento,
    buscarEvento
}
