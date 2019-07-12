<template>
    <div>
        <highcharts :options="chartFace"></highcharts>
    </div>
</template>

<script>
export default {
    data: () => ({
        chartFace: {
            title: {
                text: 'Requerimientos con Atención No Presencial',
                style: {
                    color: '#F28931',
                    fontWeight: 'bold'
                }
            },
            subtitle: {
                text: 'OC Caricuao'
            },
            chart: {
                plotShadow: false,
                backgroundColor:'transparent',
                margin: [0, 0, 0, 0]
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    size: '110%'
                }
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
            series: [{
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: [
                    ['Chrome', 58.9],
                    ['Firefox', 13.29],
                    ['Internet Explorer', 13],
                    ['Edge', 3.78],
                    ['Safari', 3.42],
                    {
                        name: 'Other',
                        y: 7.61,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        }
    })
}
</script>