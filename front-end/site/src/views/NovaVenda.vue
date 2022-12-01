<template>

    <form class="card-body p-md-5 " @submit.prevent="adicionar">

        <h4>Informações da Nova Venda</h4>

        <div class="form-outline mb-4 mt-4">
            <label class="form-label" for="titulo">Título</label>
            <input required v-model="venda.titulo" type="text" id="titulo" class="form-control" />
        </div>

        <div class="form-outline mb-4">
            <label class="form-label" for="descricao">Descrição</label>
            <textarea required v-model="venda.descricao" id="descricao" class="form-control" />
        </div>

        <div class="form-outline mb-4">
            <label class="form-label" for="preco">Preço</label>
            <input required v-model="venda.preco" type="number" step="any" id="preco" class="form-control" />
        </div>


        <div class="form-outline mb-4">
            <label class="form-label" for="local">Local de venda</label>
            <input required v-model="venda.localVenda" type="text" id="local" class="form-control" />
        </div>


        <div class="form-outline mb-4">
            <label class="form-label" for="imagem">Imagem do produto</label>
            <input @change="pegarImagem" required type="file" id="imagem" class="form-control" />
        </div>


        <div class="form-outline mb-4">
            <label class="form-label" for="categoria">Categoria</label>
            <select required v-model="venda.categoriaSelecionada" class="form-select">
                <option v-for="categoria in categorias" :value="categoria.id" :key="categoria.id">
                    {{ categoria.descricao }}
                </option>
            </select>
        </div>

        <div class="text-center pt-1 mb-5 pb-1">
            <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit"
                >Cadastrar</button>
        </div>

    </form>


</template>

<script>

import router from "@/router";
import { httpRequest, emitter, getCookie } from "../services/global.js";

export default {
    name: 'NovaVenda',
    beforeMount: function () {
        emitter.emit("loading", true);
        let vm = this;

        httpRequest.get("/categoria/all")
            .then(function (response) {
                vm.categorias = response.data;
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
    data() {
        return {
            categorias: [],
            venda: {
                titulo: "",
                descricao: "",
                imagem: "",
                localVenda: "",
                preco: 0,
                categoriaSelecionada: 1
            },
            categoriaSelecionada: 0
        };
    },
    methods: {
        adicionar: function () {

            emitter.emit("loading", true);

            httpRequest.post("/venda/adicionar", {
                Titulo: this.venda.titulo,
                Preco: this.venda.preco,
                Descricao: this.venda.descricao,
                IdCategoria: this.venda.categoriaSelecionada,
                Imagem: this.venda.imagem,
                LocalVenda: this.venda.localVenda
            },
                {
                    headers: { Authorization: "Bearer " + getCookie("token") }
                })
                .then(function () {


                    emitter.emit(
                        "mostrarAlerta",
                        "Venda adicionada com sucesso!!!"
                    );

                    emitter.emit("loading", false);
                    router.push("/todasvendas")
                })
                .catch(function (erro) {
                    console.log(erro)
                    emitter.emit(
                        "mostrarErro",
                        "Você não possui conexão com a internet ou o servidor está fora do ar!"
                    );
                    emitter.emit("loading", false);
                });


        },
        pegarImagem: function (event) {
            var file = event.target.files[0];
            if (!file.name.includes(".png") && !file.name.includes(".jpeg")) {
                emitter.emit(
                    "mostrarErro",
                    "O arquivo precisa ser uma imagem!"
                );
                document.getElementById('imagem').value = "";

            }
            else {
                let vm = this;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result
                        .replace('data:', '')
                        .replace(/^.+,/, '');
                    vm.venda.imagem = base64String;

                };
                reader.readAsDataURL(file);

            }

        },

    }
}
</script>