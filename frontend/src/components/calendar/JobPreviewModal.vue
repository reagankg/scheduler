<template>

<q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
>

    <q-card class="preview-modal">

        <!-- Header -->
        <div class="preview-header">

            <div>

                <div class="preview-title">
                    {{ job.task }}
                </div>

                <div class="preview-srf">
                    SRF-2026-000123
                </div>

            </div>

            <q-btn
                flat
                dense
                round
                icon="close"
                color="white"
                @click="$emit('update:modelValue', false)"
            />

        </div>

        <!-- Body -->

        <q-card-section>

            <div class="info-row">

                <div class="label">
                    Status
                </div>

                <q-badge
                    color="positive"
                    rounded
                >
                    {{ job.status }}
                </q-badge>

            </div>

            <div class="info-row">

                <div class="label">
                    Client
                </div>

                <div>
                    {{ job.client }}
                </div>

            </div>

            <div class="info-row">

                <div class="label">
                    Technician
                </div>

                <div>
                    {{ job.technician }}
                </div>

            </div>

            <div class="info-row">

                <div class="label">
                    Coordinator
                </div>

                <div>
                    {{ job.coordinator }}
                </div>

            </div>

            <div class="info-row">

                <div class="label">
                    Schedule
                </div>

                <div>

                    {{ job.date }}

                    <br>

                    {{ job.time }}

                </div>

            </div>

            <div class="info-row">

                <div class="label">
                    Priority
                </div>

                <q-chip
                    dense
                    color="orange"
                    text-color="white"
                >
                    {{ job.priority }}
                </q-chip>

            </div>

            <div class="info-row">

                <div class="label">
                    Remarks
                </div>

                <div>
                    {{ job.remarks }}
                </div>

            </div>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">

            <q-btn
                flat
                label="Close"
                v-close-popup
            />

            <q-btn
                color="green"
                label="View Full SRF"
            />

        </q-card-actions>

    </q-card>

</q-dialog>

</template>

<script setup>

defineProps({

    modelValue:Boolean,

    job:{
        type:Object,
        default:()=>({})
    }

})

defineEmits([
    'update:modelValue'
])

</script>

<style scoped>

.preview-modal{

    width:650px;

    max-width:90vw;

    border-radius:12px;

}

.preview-header{

    background:#16a34a;

    color:white;

    padding:18px 22px;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.preview-title{

    font-size:20px;

    font-weight:700;

}

.preview-srf{

    margin-top:4px;

    opacity:.8;

    font-size:13px;

}

.info-row{

    display:flex;

    padding:14px 0;

    border-bottom:1px solid #f3f4f6;

}

.label{

    width:140px;

    font-weight:600;

    color:#6b7280;

}

</style>