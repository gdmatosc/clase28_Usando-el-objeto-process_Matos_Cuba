const express=require('express')
const { Router }=express
const {fork}=require('child_process')

const apiRouterOper=Router(); 

apiRouterOper.get('/numerosRandom/:id', (req, res) => {
    let childNumRes=fork('../Clase28.desafio/b6.funciones_adicionales/operacion1.js')
    let cant = req.query.cant
    console.log("cant.apiRouterGet",cant)
    childNumRes.send({cant})
    childNumRes.on('message',resultado=>{
        console.log("resultado.apiRouterOper.Get",resultado)
        //let resultado1={ 'número random generado': '401', 'contador de cada número': 1 }
        return res.json(resultado)
    })
});

module.exports=apiRouterOper