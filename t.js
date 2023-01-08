function abrirRelatorioComAjax(params, opPrint, printUrl, opResumo, resumoURL) {
  var actionURL = document.forms[0].action
  var url = ''

  if (actionURL.indexOf(location.protocol) < 0) {
    url = getContextHostPath() + actionURL
  } else {
    url = actionURL
  }

  params['ajaxRequest'] = 'S'

  showStatusBanner()

  $('#headerValidator').load(
    actionURL + ' #headerValidator',
    params,
    function (data) {
      hideStatusBanner()
      exibirRelatorio(opPrint, printUrl, opResumo, resumoURL)
    },
  )
}

function exibirRelatorio(opPrint, printUrl, opResumo, resumoURL) {
  var op = document.forms[0].operation.value

  if (opResumo && opResumo != '' && resumoURL != '' && op == opResumo) {
    abreResumoReds(resumoURL)
  } else if (op == opPrint) {
    window.open(printUrl)
  }
}

function abrirRelatorio(num_ocorr) {
  $('form #num_ocorrencia').val(num_ocorr)

  var tela = $("form input[name='tela']")

  if (
    tela.size() &&
    (tela.val() == 'DC' ||
      tela.val() == 'ER' ||
      tela.val() == 'TC' ||
      tela.val() == 'TV' ||
      tela.val() == 'CP')
  ) {
    inserirDadosComplementares()
  } else {
    var params = {}
    params['num_ocorrencia'] = num_ocorr
    params['operation'] = 'open'
    params['exibirTermoCientificacao'] = getRadioValue(
      $("form [name='exibirTermoCientificacao']"),
    )
    params['exibirTermoCapacidadePsicomotora'] = getRadioValue(
      $("form [name='exibirTermoCapacidadePsicomotora']"),
    )
    params['exibirOcorrenciasAssociadas'] = getRadioValue(
      $("form [name='exibirOcorrenciasAssociadas']"),
    )
    abrirRelatorioComAjax(
      params,
      'loadPrint',
      'https://web.sids.mg.gov.br/reds/reports/relatorio.do?operation=loadPrint',
      'load',
      'https://web.sids.mg.gov.br/reds/dialogs/resumoEvento.do?operation=loadForSearch',
    )

    if (
      'true' ==
      getRadioValue($("form [name='exibirTermoCapacidadePsicomotora']"))
    ) {
      setTimeout(function () {
        var num_envolvidos = document.forms[0].num_envolvidos.value.split(',')

        for (var i = 0; i < num_envolvidos.length; i++) {
          if (num_envolvidos[i] != '') {
            params['operation'] = 'openTCP'
            params['num_envolvido'] = num_envolvidos[i]

            abrirRelatorioComAjax(
              params,
              'loadPrint',
              'https://web.sids.mg.gov.br/reds/reports/relatorio.do?operation=loadPrint',
              'load',
              'https://web.sids.mg.gov.br/reds/dialogs/resumoEvento.do?operation=loadForSearch',
            )
          }
        }
      }, 2000)
    }
  }
}
