<template>
    <div>
        <highcharts :options="chartFace"></highcharts>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from "firebase";
export default {
    computed: {
        ...mapState(['listQuote'])
    },
    data: () => ({
        status: [],
        chartFace: {
            title: {
                text: 'Requerimientos con Atención Presencial',
                style: {
                    color: '#DF7E2C',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                text: 'OC Caricuao'
            },
            chart: {
                type: 'bar',
                plotShadow: true,
                backgroundColor:'transparent',
            },
            credits: {
                enabled: false,
            },
            lang: {
                viewFullscreen: 'Ver pantalla grande',
                printChart: 'Imprimir Gráfico',
                downloadPNG: 'Descargar PNG imagen',
                downloadJPEG: 'Descargar JPEG imagen',
                downloadPDF: 'Descargar PDF documento',
                downloadSVG: 'Descargar SVG imagen vector',
                contextButtonTitle: 'Opciones para el gráfico'
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total requerimiento(s) por estatus'
                }
            },
            legend: {
                reversed: true,
                itemStyle: {
                    color: '#DF7E2C'
                } 
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: []
        }
    }),
    methods: {
        loadStatus(){
            this.chartFace.series = [{
                name: 'Usuario(s) citado(s)',
                data: []
            },{
                name: 'Requerimiento(s) procesados',
                data: []
            }]

            this.listQuote.forEach(q => {
                this.chartFace.xAxis.categories.push(q.request)
                q.customerSupport.forEach((c, i) => {
                    this.chartFace.series[i].data.push(c)
                })
            })

        }
    },
    created() {
        firebase.firestore()
            .collection('clientsRequests')
            .onSnapshot(s => {
                this.loadStatus()
            })
    },
}
</script>