
<template>

<div class="container mb-5">

<div class="card row mt-5 justify-content-center align-items-center bg-light" v-for="venda in vendas" :key="venda.id">
  <div class="col-2"></div>
  <div class="card-body col-8 p-md-5">
    <h4>{{ venda.titulo }} ({{venda.status}})</h4>      
    <h5>Vendedor: {{ venda.nomeVendedor }} (Nota: {{venda.notaVendedor}} )</h5>

    <h5>Categoria: {{ venda.descricaoCategoria }}</h5>
    <h5>Descrição: {{ venda.descricao }}</h5>
    <h5>Preço: R${{ venda.preco }}</h5>
    <h5>Local de venda: {{ venda.localVenda }}</h5>
    <img width="300" height="300" :id="venda.id" v-bind:src="'data:image/jpeg;base64,' + venda.imagem"/>
    <br/>

  </div>
  
  <div class="col-2"></div>


  <form class="mt-3 card rounded-3 " v-if="!venda.avaliacao" @submit.prevent="avaliar(venda.id, venda.nota)" >
    <div class="card-body">
      <span>Avaliação:</span>
      
      <input required  v-model="venda.nota" type="number" class="form-control " min="1" max="10"  />
      <button @submit="avaliar(venda.id, venda.nota)" class="btn btn-outline-primary mt-3">Enviar</button>              

    </div>
  </form>

  <form class="mt-3 card rounded-3 " v-if="venda.avaliacao">
    <div class="card-body">
      <span>Avaliação:</span>
      
      <input disabled  v-model="venda.avaliacao.nota" type="number" class="form-control " min="1" max="10"  />

    </div>
  </form>


</div>
</div>


</template>

<script>

import { httpRequest, emitter, getCookie } from "../services/global.js";


export default {

    name: "MinhasCompras",
    beforeMount: function () {
        emitter.emit("loading", true);
        let vm = this;

        httpRequest.get("/venda/minhascompras", {
        headers: { Authorization: "Bearer " + getCookie("token") }
        })
        .then(function (response) {
            emitter.emit("loading", false);
            vm.vendas = response.data;

        })
        .catch(function () {
            emitter.emit(
            "mostrarErro",
            "Você não possui conexão com a internet ou o servidor está fora do ar!"
            );
            emitter.emit("loading", false);
        });

        emitter.emit("loading", false);
  },
  data() {
    return {
      vendas: [],
    };
  },
  methods: {

    avaliar: function(IdVenda, Nota)
    {      
      emitter.emit("loading", true);

      console.log(IdVenda);
      console.log(Nota);

      httpRequest.put("/venda/avaliar",{Nota: Nota}, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {

        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "AValiação enviada com sucesso!!!"
        );
      })
      .catch(function () {
        emitter.emit(
          "mostrarErro",
          "Você não possui conexão com a internet ou o servidor está fora do ar!"
        );
        emitter.emit("loading", false);
      });
    },

  },
};
</script>