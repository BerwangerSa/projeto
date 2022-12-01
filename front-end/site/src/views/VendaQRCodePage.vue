<template>

<div class="card  justify-content-center align-items-center bg-light" v-if="venda">
      <div class="card-body p-md-5">
        <h4>{{ venda.titulo }} ({{venda.status}})</h4>      
        <h5>Vendedor: {{ venda.nomeVendedor }}</h5>
  
        <h5>Categoria: {{ venda.descricaoCategoria }}</h5>
        <h5>Descrição: {{ venda.descricao }}</h5>
        <h5>Preço: R${{ venda.preco }}</h5>
        <h5>Local de venda: {{ venda.localVenda }}</h5>
        <h5>Expira em: {{ venda.dataExpiracaoFormatada }}</h5>
        <img width="250" height="250" :id="venda.id" v-bind:src="'data:image/jpeg;base64,' + venda.imagem"/>
        <br/>
        <div class="mt-3 card rounded-3 row " v-for="questionamento in venda.questionamentos" :key="questionamento.id">
            <div class="card-body">
                <span>Questionamento: </span>
                <span class="form-control rounded-3 bg-light">{{questionamento.descricao}}</span>

                <div class="card mt-3" v-if="questionamento.resposta">
                    <div class="card-body rounded-3" >
                        <span>Resposta:</span>
                        <textarea disabled v-model="questionamento.resposta.descricao" class="form-control"></textarea>
                        <img v-if="questionamento.resposta.imagem"  class="mt-3" width="150" height="150" :id="venda.id" v-bind:src="'data:image/jpeg;base64,' + questionamento.resposta.imagem"/>
                    </div>
                </div>

            </div>
        </div>



      </div>

      
    </div>


</template>

<script>
import {
    isLogged,
    httpRequest,
    getCookie,
    emitter,
} from "../services/global";

export default {
    name: "VendaQRCodePage",
    
    data() {
        return {
            venda: null
        };
    },
    mounted: function () {

        if(!isLogged())
        {
            this.$router.push("/login");            
        }
        else
        {
            emitter.emit("loading", true);
            let vm = this;
            httpRequest.get("/venda/get", {
            headers: { Authorization: "Bearer " + getCookie("token") },
            params: {
              IdVenda: this.$router.currentRoute.value.params?.idVenda,
            },
            })
            .then(function (response) {
                vm.venda = response.data;
                emitter.emit("loading", false);

            })
            .catch(function () 
            {
                emitter.emit(
                "mostrarErro",
                "Você não possui conexão com a internet ou o servidor está fora do ar!"
                );
                emitter.emit("loading", false);
            });

        }

    },
    methods: {
    },
};
</script>