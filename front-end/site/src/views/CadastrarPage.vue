<template>

    <div class="container-fluid  gradient-form">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-xl-10 card rounded-3 text-black">
                <div class="row g-0">

                    <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                    </div>

                    <div class="col-lg-6">
                        <form class="card-body p-md-5 " @submit.prevent="cadastrarUsuario">

                            <p>Bem Vindo</p>

                            <div class="form-outline mb-4">
                                <input required type="text" id="login" class="form-control" v-model="usuario.login"/>
                                <label class="form-label" for="login">Login</label>
                            </div>
                            <div class="form-outline mb-4">
                                <input required type="text" id="nome" class="form-control" v-model="usuario.nome"/>
                                <label class="form-label" for="nome">Nome</label>
                            </div>
                            <div class="form-outline mb-4">
                                <input required id="email" class="form-control" v-model="usuario.email"/>
                                <label class="form-label" for="email">Email</label>
                            </div>

                            <div class="form-outline mb-4">
                                <input required type="password" id="senha" class="form-control" v-model="usuario.senha" />
                                <label class="form-label" for="senha">Senha</label>
                            </div>

                            <div class="text-center pt-1 mb-5 pb-1">
                                <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                    type="submit" @submit="cadastrarUsuario">Cadastrar</button>
                            </div>

                            <div class="d-flex align-items-center justify-content-center pb-4">
                                <p class="mb-0 me-2">Já tem uma conta?</p>
                                <button type="button" class="btn btn-outline-primary"
                                    v-on:click="irParaLogin">Login</button>
                            </div>

                            <div v-show="mostrarErro">
                                <div id="loginSenhaIncorretos" style="witdth: 90%; margin-left: 5%; margin-right: 5%"
                                    class="alert alert-danger text-center">
                                    {{ mensagemErro }}
                                </div>
                                <br />
                            </div>

                        </form>
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

import { httpRequest, emitter } from "../services/global.js";
export default {
    name: 'CadastrarPage',
    data() {
        return {
            mensagemErro: "",
            mostrarErro: false,
            loader: "spinner",
            usuario: {
                login: "",
                senha: "",
                email: "",
                nome: ""
            },
        };
    },
    methods: {
        irParaLogin: function () {
            router.push("/login")
        },
        cadastrarUsuario: function () {
            this.mensagemErro = "";
            this.mostrarErro = false;
            emitter.emit("loading", true);
            let vm = this;

            httpRequest.post("/usuario/cadastrar",
                {
                    Login: this.usuario.login,
                    Senha: this.usuario.senha,                    
                    Email: this.usuario.email,
                    Nome: this.usuario.nome,
                })
                .then(function (response) {
                    if (response.data.errorCode == 404) {
                        vm.mostrarErro = true;
                        vm.mensagemErro = response.data.msgErro;
                    }
                    else {
                        emitter.emit(
                            "mostrarAlerta",
                            "Usuário cadastrado com sucesso!!!"
                        );
                        router.push("/login");
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
        }
    }
}
</script>
  