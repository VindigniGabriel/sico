<template>
    <div>
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
        <v-select
            v-model="select"
            :items="requestName"
            :rules="[v => !!v || 'Item is required']"
            label="Item"
            required
            @change="view"
        ></v-select>

            <v-text-field
            v-model="phone"
            label="Línea"
            v-if="result.phone"
            ></v-text-field>


            <v-select
            v-model="technologies"
            :items="result.technologies"
            label="Item"
            required
             item-text="name"
             @change="viewff"
            ></v-select>

            <v-select
            v-model="plan"
            :items="subResult"
            label="Item"
            required
            v-if="viewPlan"
            ></v-select>
        


        </v-form>
       {{result.name}}
    </div>
</template>

<script>
export default {
    data(){
        return{
            viewPlan: false,
            plan: '',
            technologies: '',
            phone: '',
            valid: true,
            select: '',
            requestName: [],
            result:{name: '',
                phone: '',
                technologies: []
            },
            subResult: [],
            requests: [
                {name: 'Cambio de Plan',
                phone: true,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: ['PlanPreG 1', 'PlanPreG 2'],
                    aplications: ['RTB']},
                    {name: 'Pre/CDMA',
                    subRequest: ['PlanPreC 1', 'PlanPreC 2'],
                    aplications: ['SINAPSIS']},
                    {name: 'Cre/GSM',
                    subRequest: ['PlanCreG 1', 'PlanCreG 2'],
                    aplications: ['XPERT/CSM']},
                    {name: 'Cre/CDMA',
                    subRequest: ['PlanCreC 1', 'PlanCreC 2'],
                    aplications: ['XPERT/CSM']}
                ]},
                {name: 'Venta de Sim Card',
                phone: true,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: []},
                    {name: 'Cre/GSM',
                    subRequest: []}
                ]},
                {name: 'Línea Nueva',
                phone: false,
                technologies: [
                    {name: 'Pre/GSM',
                    subRequest: ['PlanPre 1', 'PlanPre 2']},
                    {name: 'Cre/GSM',
                    subRequest: ['PlanCre 1', 'PlanCre 2']}
                ]}
            ]
        }
    },
    mounted() {
        this.requests.forEach(request => {
            this.requestName.push(request.name)
        })        
    },
    methods: {
        view(){
            this.viewPlan = false
            this.technologies = ''
            this.plan = ''
            this.requests.filter(request => request.name === this.select).forEach(result => {
                this.result = result
            })
        },
        viewff(){
            this.plan = ''
            this.result.technologies.filter(result => result.name === this.technologies).forEach(result => {
                this.subResult =  result.subRequest
            })
            this.viewPlan = (this.subResult.length > 0)? true : false  
        }
    }
}
</script>
