<template >

  <div class="card container-fluid col-11 mt-5 justify-content-center align-items-center bg-light" >
    <div class="card-body col-8 p-md-5">
      <input v-model="filtro" class="rounded-3"/>    
      <button @click="pesquisar" class="ms-3 btn btn-outline-primary">Pesquisar</button>
    </div>
  </div>

  <div class="container mb-5">

    <div class="card row mt-5 justify-content-center align-items-center bg-light" v-for="venda in vendas" :key="venda.id">
      <div class="col-2"></div>
      <div class="card-body col-8 p-md-5">
        <h4>{{ venda.titulo }} ({{venda.status}})</h4>
        <button v-if="venda.ehCriadorDaVenda && venda.idStatus < 3"  @click="cancelarVenda(venda.id)" class="btn btn-outline-danger mt-3 mb-3">Cancelar Venda</button>              
      
        <h5>Vendedor: {{ venda.nomeVendedor }} (Nota: {{venda.notaVendedor}} )</h5>
  
        <h5>Categoria: {{ venda.descricaoCategoria }}</h5>
        <h5>Descrição: {{ venda.descricao }}</h5>
        <h5>Preço: R${{ venda.preco }}</h5>
        <h5>Local de venda: {{ venda.localVenda }}</h5>
        <img width="300" height="300" :id="venda.id" v-bind:src="'data:image/jpeg;base64,' + venda.imagem"/>
        <br/>
        <button v-if="venda.idStatus == 1 && venda.ehParaComprar" @click="comprar(venda.id, $event)" class="btn btn-outline-primary mt-3">Comprar</button>
        <button v-if="venda.idStatus == 2 && venda.ehParaCancelar" @click="cancelar(venda.id, $event)"  class="btn btn-outline-primary mt-3">Cancelar</button>
        <button v-if="venda.idStatus == 2 && venda.ehParaRejeitar" @click="aceitarcompra(venda.id, $event)" class="btn btn-outline-primary mt-3">Aceitar</button>
        <button v-if="venda.idStatus == 2 && venda.ehParaRejeitar" @click="rejeitar(venda.id, $event)" class="btn btn-outline-primary mt-3">Rejeitar</button>

        <div class="mt-3 card rounded-3 " v-for="questionamento in venda.questionamentos" :key="questionamento.id">
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

          <div class="card mt-3" v-if="(!questionamento.resposta) && venda.ehParaRejeitar">
            <div class="card-body rounded-3" >
              <span>Resposta:</span>
              <textarea v-model="questionamento.respostaTexto" class="form-control"></textarea>
              <input @change="pegarImagem($event, questionamento)" required type="file" id="imagem" class="form-control mt-3" />
              <button @click="responder(venda.id, questionamento)" class="btn btn-outline-primary mt-3">Responder</button>              
            </div>
          </div>

          </div>
        </div>


        <div v-if="venda.ehParaComprar">
          <textarea v-model="venda.comentario" class="form-control mt-5"></textarea>
          <button class="btn btn-outline-primary mt-4" @click="enviarComentario(venda.id, venda.comentario)">Enviar</button>
        </div>

      </div>

      
      <div class="col-2"></div>


    </div>
  </div>
</template>

<script>

import { httpRequest, emitter, getCookie } from "../services/global.js";

export default {
  name: 'TodasVendas',
  beforeMount: function () {
    emitter.emit("loading", true);
    let vm = this;

    httpRequest.get("/venda/all", {
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
      filtro: "",
    };
  },
  methods: {
    comprar: function(IdVenda)
    {      
      emitter.emit("loading", true);

      httpRequest.put("/venda/pedircompra",'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=' + window.location.origin + "/venda/"+IdVenda, {
        headers: { Authorization: "Bearer " + getCookie("token"), 'Content-Type': 'application/json' },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {
        location.reload()

        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Pedido de compra feito com sucesso!!!"
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
    cancelar: function(IdVenda)
    {
      emitter.emit("loading", true);

      httpRequest.put("/venda/cancelarpedido",{}, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {
        location.reload()

        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Pedido de compra cancelado com sucesso!!!"
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
    rejeitar: function(IdVenda)
    {
      emitter.emit("loading", true);

      httpRequest.put("/venda/rejeitarpedido",{}, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {

        location.reload()

        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Pedido de rejeitado com sucesso!!!"
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
    aceitarcompra: function(IdVenda)
    {
      emitter.emit("loading", true);

      httpRequest.put("/venda/aceitarcompra",{}, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {

        location.reload()
        
        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Pedido aceito com sucesso!!!"
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
    enviarComentario:function(IdVenda, Comentario)
    {
      emitter.emit("loading", true);

      httpRequest.put("/venda/adicionarcomentario",{}, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
          Comentario: Comentario

        },
    })
      .then(function () {

        location.reload()


        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Comentário enviado com sucesso!!!"
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
    pegarImagem: function (event, questionamento) {
            var file = event.target.files[0];
            if (!file.name.includes(".png") && !file.name.includes(".jpeg")) 
            {
                emitter.emit(
                    "mostrarErro",
                    "O arquivo precisa ser uma imagem!"
                );
                document.getElementById('imagem').value = "";

            }
            else 
            {
                const reader = new FileReader();
                reader.onloadend = () => {
                  questionamento.imagem = reader.result
                        .replace('data:', '')
                        .replace(/^.+,/, '');

                };
                reader.readAsDataURL(file);

            }

    },
    responder: function(IdVenda, questionamento)
    {
      if(!questionamento.respostaTexto)
        return;

      emitter.emit("loading", true);

      httpRequest.put("/venda/ResponderComentario",{
        Resposta: questionamento.respostaTexto,
        Imagem: questionamento.imagem
      }, {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
          IdQuestionamento: questionamento.id

        },
    })
      .then(function () {

        location.reload()

        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Resposta enviada com sucesso!!!"
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
    pesquisar: function()
    {
      emitter.emit("loading", true);

      let vm = this;
      httpRequest.get("/venda/filtrar", {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          Filtro: this.filtro,
        },
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

    },
    cancelarVenda: function(IdVenda)
    {
      emitter.emit("loading", true);

      httpRequest.get("/venda/cancelarvenda", {
        headers: { Authorization: "Bearer " + getCookie("token") },
        params: {
          IdVenda: IdVenda,
        },
    })
      .then(function () {
        emitter.emit("loading", false);
        emitter.emit(
          "mostrarAlerta",
          "Venda cancelada com sucesso!"
        );
        location.reload()

      })
      .catch(function () {
        emitter.emit(
          "mostrarErro",
          "Você não possui conexão com a internet ou o servidor está fora do ar!"
        );
        emitter.emit("loading", false);
      });

    },
  }
}
</script>