
<template>
    <div v-if="mostrarAlerta" class="modal mt-5" style="display: block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fa fa-exclamation-triangle text-warning" style="width: 32x; height: 32px"></i>
                    <h5 class="modal-title" style="margin-left: 1%">Atenção</h5>
                    <button @click="fecharModal" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body my-2">
                    <span><b>{{ MsgAlert }}</b></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="fecharModal" data-bs-dismiss="modal">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { emitter } from "../services/global.js";

export default {
    name: "ModalErro",
    data() {
        return {
            MsgAlert: "",
            mostrarAlerta: false,
        };
    },
    mounted: function () {
        emitter.on("mostrarAlerta", (alertMessage) => {
            this.MsgAlert = alertMessage;
            this.mostrarAlerta = true;
        });
    },

    methods: {
        fecharModal: function () {
            this.MsgAlert = "";
            this.mostrarAlerta = false;
        },
    },
};
</script>