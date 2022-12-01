
<template>
    <div class="p-md-5 " >

        <h4>Painel Administrativo</h4>
        <button @click="desativarTodos" class="btn btn-outline-danger">Desativar vendas dos últimos 45 dias</button>

        <div class="row">
            <div class="col-3"></div>
            <div v-if="infoAdmin" class="card mt-3 col-6">
                <div class="card-body">
                    <h5>Vendas</h5>

                    <span>Total de itens anunciados: {{infoAdmin.totalVendas}}</span>
                    <br/>
                    <span>Total de itens cancelados: {{infoAdmin.totalCancelado}}</span>
                    <br/>
                    <span>Total de itens expirados: {{infoAdmin.totalExpirado}}</span>
                    <br/>
                    <span>Total de itens vendidos: {{infoAdmin.totalVendido}}</span>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-3"></div>
            <div v-if="infoAdmin" class="card mt-3 col-6">
                <div class="card-body">
                    <h5>Vendedores</h5>
                    <hr/>

                    <div v-for="vendedor in infoAdmin.infoVendedores" v-bind:key="vendedor.id">

                        <span>Nome: {{vendedor.nome}}</span>
                        <br/>
                        <span>Avaliação: {{vendedor.avaliacao}}</span>
                        <br/>
                        <span>Total de produtos ofertados: {{vendedor.totalProdutosOfertados}}</span>
                        <br/>
                        <span>Total de produtos vendidos: {{vendedor.totalProdutosVendidos}}</span>
                        <br/>
                        <span>Total de questionamentos: {{vendedor.totalQuestionamentos}}</span>
                        <br/>

                        <span>Total de respostas: {{vendedor.totalRespostas}}</span>
                        <br/>

                        <hr/>
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>
<style scoped lang="scss">
.menu-hover:hover,
.menu-hover:active,
.menu-hover:focus {
    color: black;
}
</style>
<script>

import router from "@/router";
import { httpRequest, emitter, isAdmin, getCookie } from "../services/global.js";


export default {

    name: "PainelAdministrativo",
    data() {
        return {
            infoAdmin: null
        };
    },
    beforeUpdate: function()
    {
        if(!isAdmin())
        {
            router.push("/todasvendas");
            return;
        }        
        
    },

    beforeMount: function()
    {

        if(!isAdmin())
        {
            router.push("/todasvendas");
            return;
        }        

        emitter.emit("loading", true);

        let vm = this;
        httpRequest.post("/usuario/getinfoadmin", {},
            {
                headers: { Authorization: "Bearer " + getCookie("token") }
            })
            .then(function (response) {
                emitter.emit("loading", false);
                vm.infoAdmin = response.data;
                
            })
            .catch(function () {
                emitter.emit(
                    "mostrarErro",
                    "Você não possui conexão com a internet ou o servidor está fora do ar!"
                );
                emitter.emit("loading", false);
        });
    },
    methods: {
        desativarTodos: function()
        {
            emitter.emit("loading", true);
    
            httpRequest.post("/venda/desativarVendasUltimos45Dias", {},
            {
                headers: { Authorization: "Bearer " + getCookie("token") }
            })
            .then(function () {
                emitter.emit("loading", false);
                emitter.emit("mostrarAlerta",
                "Vendas dos últimos 45 dias canceladas com sucesso!");
                
            })
            .catch(function () {
                emitter.emit(
                    "mostrarErro",
                    "Você não possui conexão com a internet ou o servidor está fora do ar!"
                );
                emitter.emit("loading", false);
            });
        }
    },
};
</script>