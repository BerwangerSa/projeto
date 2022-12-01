<template>

  <div class="container-fluid  gradient-form">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-xl-10 card rounded-3 text-black mt-5">
        <div class="row g-0 ">
          <div class="col-lg-6">
            <form class="card-body p-md-5 " @submit.prevent="login">

              <p>Bem Vindo</p>

              <div class="form-outline mb-4">
                <input required type="text" id="login" class="form-control" v-model="usuario.login" />
                <label class="form-label" for="login">Login</label>
              </div>

              <div class="form-outline mb-4">
                <input required type="password" id="senha" class="form-control" v-model="usuario.senha" />
                <label class="form-label" for="senha">Senha</label>
              </div>

              <div class="text-center pt-1">
                <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit"
                  v-on:submit="login">Login</button>
              </div>             
            </form>

            <div class="d-flex align-items-center justify-content-center pb-4">
                <p class="mb-0 me-2">Não tem uma conta?</p>
                <button type="button" class="btn btn-outline-primary" v-on:click="irParaCadastro">Cadastrar</button>
              </div>

              <div v-show="mostrarErro">
                <div id="loginSenhaIncorretos" style="witdth: 90%; margin-left: 5%; margin-right: 5%"
                  class="alert alert-danger text-center">
                  {{ mensagemErro }}
                </div>
                <br />
              </div>


          </div>
          <div class="col-lg-6 d-flex align-items-center gradient-custom-2 text-white text-align-center">
          </div>
        </div>
      </div>
    </div>
  </div>



</template>


<style>
.gradient-custom-2 {
  background: #2a2a72;

  background: -webkit-linear-gradient(315deg, #009ffd 0%, #2a2a72 74%);

  background: linear-gradient(315deg, #009ffd 0%, #2a2a72 74%);
}
</style>

<script>

import router from ".././router";
import { isLogged, httpRequest, emitter, logar } from "../services/global.js";

export default {
  name: 'LoginPage',
  beforeMount: function () {
    if (isLogged()) {
      router.push("/todasvendas");
    } else {
      emitter.emit("atualizarNavbar", false);
    }
  },
  data() {
    return {
      mensagemErro: "",
      mostrarErro: false,
      loader: "spinner",
      usuario: {
        login: "",
        senha: "",
      },
    };
  },
  methods: {
    irParaCadastro: function () {
      router.push("/cadastrar");

    },
    login: function () {
      this.mensagemErro = "";
      this.mostrarErro = false;
      emitter.emit("loading", true);
      let vm = this;
      httpRequest.post("/usuario/login",
        {
          Login: this.usuario.login,
          Senha: this.usuario.senha,
        })
        .then(function (response) {

          if (response.data.errorCode == 404) {
            vm.mostrarErro = true;
            vm.mensagemErro = response.data.msgErro;
          }
          else {
            logar(response.data.usuario.login, response.data.usuario.isAdmin, response.data.token, response.data.dataExpiracaoToken);
            emitter.emit("atualizarNavbar", true);
            router.push("/todasvendas");
          }
          emitter.emit("loading", false);
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
