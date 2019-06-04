// FUNCAO PARA VERIFICAR SE AS OPCOES SELECIONADAS BATEM COM AS 3 NOTAS DE CADA PERFUME
// RECEBE OS AS OPCOES SELECIONDAS (VALORES), AS NOTAS DA ESSENCIA (ESSENCIA) E INDICE (QUE NAO E UTILIZADO AQUI, MAS NO RETORNO DA FUNÃƒâ€¡ÃƒÆ’O)
function BuscaRef(valores, essencia, indice) {

	return new Promise(function(resolve, reject) {

		var temp = 0;

		// PARA CADA NOTA DO PERFUME, VARRE A STRING DE VALORES
		$.each( essencia, function( key, nota ) {

			// TAMANHO NO NOTA (EM CARACTERES)
			var sizenota = nota.length;
	
			var start = 0;

			while (start != -1) {

				var tamanho = valores.length - 1;
				var posicao = valores.indexOf(nota, start+1);
				start = posicao;

				// VERIFICA SE ESTA NO FIM DA STRING DE VALORES
				if ((posicao+sizenota-1) == tamanho && valores.charAt(posicao - 1) == ' ') {
					temp++;
					start = -1;
				}

				// VERIFICA SE ESTA NO INICIO DA STRING DE VALORES
				if (posicao == 0 && valores.charAt(posicao + sizenota) == ' ') {
					temp++;
					start = -1;
				}

				// VERIFICA SE ESTA NO MEIO DA STRING DE VALORES
				if (posicao > 0 && (posicao+sizenota-1) < tamanho && valores.charAt(posicao + sizenota) == ' ' && valores.charAt(posicao - 1) == ' ') {
					temp++;
					start = -1;
				}

			}

			// SE ESTA NA ULTIMA NOTA, PREPARA O RETORNO
			if ( key == '3'){
				
				switch (true) {

					case temp == 3:
						resolve(2); //mosca
						break;
					case temp == 2:
						resolve(1); // provavel
						break;
					case temp < 2:
						resolve (0);
						break;
				}

			}
			
		});

	});

}


//FUNCAO RECURSIVA QUE CARREGA OS PRODUTOS DA CATEGORIA 1 (PERFUMES) EM UM ARRAY USANDO API VTEX
//INICIAR COM VALORES DE = 0 E ATE = 30
function LoadApi(de, ate){

	return new Promise((resolve, reject) => {

		$.getJSON('/api/catalog_system/pub/products/search?fq=C:/1/&_from='+de+'&_to='+ate, function(data, status, xhrresp) {

			// RESGATA O TOTAL DE PRODUTOS ATRAVES DO HEADER DO RETORNO
	 		var registros = xhrresp.getResponseHeader("resources").split('/').pop();

	 		var retorno = [];

	 		var contador = de;

	 		for (prod = 0; prod < 30; prod++) {

	 			if (typeof data[prod] != 'undefined') {

		 			var perfume = data[prod];
		 			var id = perfume.productId;

		 			// VERIFICA SE O PERFUME TEM AS 3 NOTAS DEFINIDAS. SE SIM, ADICIONA O MESMO NO ARRAY DE RESULTADOS POSSIVEL PARA O QUIZ
		 			if (typeof perfume.Nota1 != 'undefined' && typeof perfume.Nota2 != 'undefined' && typeof perfume.Nota3 != 'undefined' && typeof perfume.productName != 'undefined' && typeof perfume.link != 'undefined') {
		 				retorno[id] = {
							'n1': perfume.Nota1[0],
							'n2': perfume.Nota2[0],
							'n3': perfume.Nota3[0],
							'nome': perfume.productName,
							'title': perfume.productTitle,
							'link': perfume.link,
							'composicao': perfume.Baseado[0]
						};

						for (i = 0; i < perfume.items.length; i++) {

			                sku = perfume.items[i];

			                for (j = 0; j < sku.images.length; j++) {

			                    img = sku.images[j];

			                    if (img.imageLabel.toLowerCase() == "vitrine1" || img.imageLabel.toLowerCase().indexOf("vitrineambiente") > -1 || img.imageLabel == "") {

			                        tag = img.imageTag.replace(/#width#/g, "300").replace(/#height#/g, "300").replace("~", "");

			                        retorno[id].img = tag;

			                        achou = 1;
			                        	
			                        break;

			                    }

			                }

			                if (tag != "") {

			                    break;

			                }

			                if (achou == 0 && i == perfume.items.length - 1) {
			            	
			                	retorno[id].img = perfume.items[0].images[0].imageTag.replace(/#width#/g, "300").replace(/#height#/g, "300").replace("~", "");

			           		}

			            }

			        }

			        contador++;

			        if (prod == 29) {

			            if (contador < registros && contador >= ate) {

			            	LoadApi(contador, ate + 30).then(function(response){
			            		var final = $.merge(retorno, response);
			            		resolve(final);
			            	});
	
			            } else {

			            	if (ate >= registros && contador > registros) {
	
			            		resolve(retorno);

			            	}

			            }

			        }

	           	} else {

	            	resolve(retorno);

	           	}

	 		}

	 	});

    });

}


$(document).ready(function(){

	console.log('mudou14');

	var essencias = [];

	//CARREGA A LISTA DE PERFUMES POSSIVEIS PARA O RESULTADO
	LoadApi(0, 30).then(function(response){  
		essencias = response; 
	});

	// OCULTA O INICIO E MOSTRA A BARRA DE PASSOS
	$('html body').on('click', '#quiz-content0', function(){
	
		$('section#quiz-content0, div#rodapequiz').addClass('quiz-inativo');
		$('section#barraprogresso').removeClass('quiz-inativo');
		$('section#quiz-content1').removeClass('quiz-inativo');
		$('div.page').addClass('fundo1');
	
	});

	//ARMAZENA A OPCAO SELECIONADA E MOSTRA O RESULTADO NO PASSO 7
	$('html body').on('click', 'a.opcao', function(){

		var questao = $(this).parent().parent().attr('data-quiz');
		var proxima = parseInt(questao) + 1;
		$('div.page').removeClass('fundo'+questao);
		if (questao != 7) {
			$('div.page').addClass('fundo'+proxima);
		}

		$(this).parent().find('input.valor').val($(this).attr('valor'));

		if (questao == 7) {

			$('section#barraprogresso').addClass('quiz-inativo');
			$('div.page').css('overflow-y','auto');

			$('div#resultado1').removeClass('quiz-inativo');
			$('div#resultado2').removeClass('quiz-inativo');

			var valores = $('input#valor1').val()+' '+$('input#valor2').val()+' '+$('input#valor3').val()+' '+$('input#valor4').val()+' '+$('input#valor5').val()+' '+$('input#valor6').val()+' '+$('input#valor7').val();

			var mosca = [];
			var provavel = [];

			var ultimo = essencias.length - 1;

			$.each( essencias, function( key, perfume ) {

				if (typeof perfume != 'undefined' && typeof perfume.n1 != 'undefined' && typeof perfume.n2 != 'undefined' && typeof perfume.n3 != 'undefined') {

					var notas = {
						'1': perfume.n1,
						'2': perfume.n2,
						'3': perfume.n3
					}

					BuscaRef(valores, notas, key).then(function(response){
						
						if (response == 2){
							mosca.push(key);
						}

						if (response == 1){
							provavel.push(key);
						}

						if (key == ultimo) {

							if 	(mosca.length > 0) {

								var contador1 = 0;
								var contadorgeral1 = 0;
								var html1 = '';
								var total1 = mosca.lenght;
								
								$.each( mosca, function (key, numperfume){

									if (contador1 == 0) {
										html1 += '<ul>';
									}

									html1 += '<li layout="" class="perfumes"><div class="box-item text-center" ><a class="product-image not-hover" title="'+essencias[numperfume].title+'" href="'+essencias[numperfume].link+'"><div class="not-hover principal">'+essencias[numperfume].img+'</div></a><div class="product-name"><a title="'+essencias[numperfume].title+'" href="">'+essencias[numperfume].nome+'<div class="baseado"><div class="product-field"><ul><li>'+essencias[numperfume].composicao+'</li></ul></div></div></a></div><div class="experimente"><a href="'+essencias[numperfume].link+'" class="btn-add-buy-button-asynchronous">EXPERIMENTE</a></div></div></li>';
									
									contador1++;
									contadorgeral1++;

									if (contador1 == 4 || contadorgeral1 == total1) {
										html1 += '</ul>';
										contador1 = 0;
									}

								});

								$('div#resultado1').html(html1);
								$('div#resultado1').removeClass('quiz-inativo');
								$('div#frase1').removeClass('quiz-inativo');

								if (provavel.length > 0) {

									var contador2 = 0;
									var contadorgeral2 = 0;
									var html2 = '';
									var total2 = provavel.lenght;
									
									$.each( provavel, function (key, numperfume){

										if (contador2 == 0) {
											html2 += '<ul>';
										}

										html2 += '<li layout="" class="perfumes"><div class="box-item text-center" ><a class="product-image not-hover" title="'+essencias[numperfume].title+'" href="'+essencias[numperfume].link+'"><div class="not-hover principal">'+essencias[numperfume].img+'</div></a><div class="product-name"><a title="'+essencias[numperfume].title+'" href="">'+essencias[numperfume].nome+'<div class="baseado"><div class="product-field"><ul><li>'+essencias[numperfume].composicao+'</li></ul></div></div></a></div><div class="experimente"><a href="'+essencias[numperfume].link+'" class="btn-add-buy-button-asynchronous">EXPERIMENTE</a></div></div></li>';

										contador2++;
										contadorgeral2++;

										if (contador2 == 4 || contadorgeral2 == total1) {
											html2 += '</ul>';
											contador2 = 0;
										}
									
									});

									$('div#resultado2').html(html2);
									$('div#resultado2').removeClass('quiz-inativo');
									$('div#frase2').removeClass('quiz-inativo');

								}

							} else {
								
								if (provavel.length > 0) {

									var contador2 = 0;
									var contadorgeral2 = 0;
									var html2 = '';
									var total2 = provavel.lenght;
									
									$.each( provavel, function (key, numperfume){

										if (contador2 == 0) {
											html2 += '<ul>';
										}

										html2 += '<li layout="" class="perfumes"><div class="box-item text-center" ><a class="product-image not-hover" title="'+essencias[numperfume].title+'" href="'+essencias[numperfume].link+'"><div class="not-hover principal">'+essencias[numperfume].img+'</div></a><div class="product-name"><a title="'+essencias[numperfume].title+'" href="">'+essencias[numperfume].nome+'<div class="baseado"><div class="product-field"><ul><li>'+essencias[numperfume].composicao+'</li></ul></div></div></a></div><div class="experimente"><a href="'+essencias[numperfume].link+'" class="btn-add-buy-button-asynchronous">EXPERIMENTE</a></div></div></li>';

										contador2++;
										contadorgeral2++;

										if (contador2 == 4 || contadorgeral2 == total1) {
											html2 += '</ul>';
											contador2 = 0;
										}
									
									});

									$('div#frase2 span#grande').html('ESTES COMBINAM');
									$('div#resultado2').html(html2);
									$('div#resultado2').removeClass('quiz-inativo');
									$('div#frase2').removeClass('quiz-inativo');

								} else {
									
									console.log('nenhum');
									console.log(valores, mosca, provavel);

								}

							}
							
						}

					});

				}
			    
			});
		
		}

		
		$('section#quiz-content'+questao).addClass('quiz-inativo');
		$('section#quiz-content'+proxima).removeClass('quiz-inativo');
		$('div#bolinha'+proxima).removeClass('no-color').addClass('info-color');
		window.scrollTo(0,0);
		
	
	});
	
});