
<template>
    <nav class="navbar navbar-expand-lg navbar-light" style="
        box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 3px 1px;
        background-color: #2a2a72;
        background-image: linear-gradient(315deg, #009ffd 0%, #2a2a72 74%);
        min-height: 65px;" >
        <div class="container-fluid" v-if="isLogado">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/todasvendas" class="text-light text-decoration-none">
                            <div class="menu-hover" style="margin-left: 20px; cursor: pointer">
                                <span><b>Todos as vendas</b></span>
                                <br />
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/novavenda" class="text-light text-decoration-none">
                            <div class="menu-hover" style="margin-left: 20px; cursor: pointer">
                                <a>
                                    <span><b>Nova venda</b></span>
                                    <br />
                                </a>
                            </div>
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/minhascompras" class="text-light text-decoration-none">
                            <div class="menu-hover" style="margin-left: 20px; cursor: pointer">
                                <a>
                                    <span><b>Minhas Compras</b></span>
                                    <br />
                                </a>
                            </div>
                        </router-link>
                    </li>

                    <li class="nav-item" v-if="admin">
                        <router-link to="/paineladministrativo" class="text-light text-decoration-none">
                            <div class="menu-hover" style="margin-left: 20px; cursor: pointer">
                                <a>
                                    <span><b>Administração</b></span>
                                    <br />
                                </a>
                            </div>
                        </router-link>
                    </li>

                </ul>
            </div>

            <div class="d-flex text-light">
               
                <div @click="logout" class="menu-hover" style="margin-right: 20px; cursor: pointer">
                    <a>
                        <span><b>Sair</b></span>
                        <br />
                    </a>
                </div>
            </div>
        </div>
    </nav>
</template>
<style scoped lang="scss">
.menu-hover:hover,
.menu-hover:active,
.menu-hover:focus {
    color: black;
}
</style>
<script>
import {
    httpRequest,
    getCookie,
    isLogged,
    emitter,
    deslogar,
    isAdmin
} from "../services/global";
import router from "../router";

export default {

    name: "NavBar",
    data() {
        return {
            isLogado: isLogged(),
            admin: isAdmin(),            
        };
    },
    beforeUpdate: function()
    {
        this.admin = isAdmin();

    },
    mounted: function () {


        emitter.on("atualizarNavbar", (mostrar) => {
            this.isLogado = mostrar;
        });
    },
    methods: {
        logout: function () {
            emitter.emit("loading", true);

            httpRequest
                .post("/usuario/logout", {}, {
                    headers: {
                        Authorization: "Bearer " + getCookie("token") },
                })
                .then(function () {
                    deslogar();
                    emitter.emit("atualizarNavbar", false);
                    router.push("/login");
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
    },
};
</script>