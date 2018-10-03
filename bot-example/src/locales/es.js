export default {

	keywords:{
		positive:{
			regex:["^(por supuesto|puede que alguna vez|algo, alguna vez, sí|¡Sí!|oui|sí|si|enviar un plato|muy sutilmente, sí|sutilmente|pues sí, minimalismo|correcto|claro|ok|yes|sim|ken|yep|ndiyo|shi|sii|da|positivo|si, sal|existe|siii|si!|yah|yeah)[?!.,¿]*$"] 
		},
		negative:{
			regex:["^(¡Ups! No…|¡Qué va!|¿Quemar? ¿Yo? Nah|Crudo no, a mi punto|No, frío nunca|¿Picante? ¿Yo? Nah|No se dan cuenta|¿Ajo? ¿Yo? Nah|No, yo me complico|no|nop|nope|¡no!|non|ne|nei|não|incorrecto|ni de coña|no, no|negativo|no existe|nah|nooo|noo|fatal|negative)[?!.,¿]*$"]
		}
	},

	intro:{
		copys:{
			copy_1:["¡Vamos allá! ⚡️"],
			copy_2:["Oh, por fin estás aquí ____. Soy Valentín Egó, coach gastronómico y cookhunter. Y estás a punto de descubrir la magia que esconden tus manjares.",
			"Te estaba esperando ____, soy Valentín Egó, coach gastronómico y cookhunter. Y estás a punto de descubrir la magia que esconden tus manjares.",
			"Hey ____, soy Valentín Egó, coach gastronómico y cookhunter. Por ese orden. Y estás a punto de descubrir la magia que esconden tus manjares."],
			copy_3:["Antes que nada, si en algún momento del coaching te pierdes puedes escribir SOS, pero empecemos por los principios. ¿Tienes cocina?"]
		},

		buttons:{
			button_1:["¡Por supuesto!"],
			button_2:["¡Ups! No..."]
		},
	},

	culinary_world:{
		option_1:{
			copys:{
				copy_1:["Entonces ya eres cocinero 👨🏻‍🍳"],
				copy_2:["Vamos, seguro que algún fogón habrás rozado, así que ya eres cocinero 👨🏻‍🍳"],
				copy_3:["Pero sabes qué, el mundo culinario está lleno de críticos baratos. ¿Alguna vez has escuchado eso de “le falta sal”?"],
			},

			buttons:{
				button_1:["Puede que alguna vez"],
				button_2:["¡Qué va!"]
			}									
		},
		option_2:{
			copys:{
				copy_1:["Entonces ya eres cocinero 👨🏻‍🍳"],
				copy_2:["Vamos, seguro que algún fogón habrás rozado, así que ya eres cocinero 👨🏻‍🍳"],
				copy_3:["Pero sabes qué, el mundo culinario está lleno de críticos baratos, ¿alguna vez has escuchado eso de “está frío”?"],
			},

			buttons:{
				button_1:["Puede que alguna vez"],
				button_2:["No, frío nunca"]
			}				
		},
		option_3:{
			copys:{
				copy_1:["Entonces ya eres cocinero 👨🏻‍🍳"],
				copy_2:["Vamos, seguro que algún fogón habrás rozado, así que ya eres cocinero 👨🏻‍🍳"],
				copy_3:["Pero sabes qué, el mundo culinario está lleno de críticos baratos, ¿alguna vez has escuchado eso de “está un poco soso”?"],
			},

			buttons:{
				button_1:["Puede que alguna vez"],
				button_2:["¡Qué va!"]
			}				
		}
	},

	flavours:{
		option_1:{
			copys:{
				copy_1:["Tal vez solo le sobrara dulzura. El argumento emocional siempre suma."],
				copy_2:["Entonces te sobra dulzura. ¡Good! El ingrediente emocional suma."],
				copy_3:["El punto de cocción es muy personal. ¿Alguna vez se te ha quemado algo de carne?"],
			},

			buttons:{
				button_1:["Algo, alguna vez, sí"],
				button_2:["¿Quemar? ¿Yo? Nah"],
			}
		},
		
		option_2:{
			copys:{
				copy_1:["En realidad lo dejaste reposar. Todo plato necesita su dosis de aire fresco ❄️"],
				copy_2:["Qué control. Exacto, para frío el abrazo de una suegra ❄️"],
				copy_3:["Y qué tal llevas el picante ¿te has pasado alguna vez?"],
			},

			buttons:{
				button_1:["Algo, alguna vez, sí"],
				button_2:["¿Picante? ¿Yo? Nah"],
			}
		},
		
		option_3:{
			copys:{
				copy_1:["¿Soso? No entendieron el concepto. Era purista. Sin aditivos ni conservantes."],
				copy_2:["GIF/5"],
				copy_3:["Y qué tal llevas el tema del ajo ¿te has pasado alguna vez?"],
			},

			buttons:{
				button_1:["Algo, alguna vez, sí"],
				button_2:["¿Ajo? ¿Yo? Nah"],
			}
		},
	},

	have_you_ever:{
		option_1:{
			copys:{
				copy_1:["¿Y quién no? Saca tu punto más exótico y llámalo “Crunchy” 💅🏻"],
				copy_2:["¡Qué tempo! Quemado estará el cenicero de un bingo ☘️☘️☘️"],
				copy_3:["¿Alguna vez te ha salido un poco crudo el tema?"],
			},

			buttons:{
				button_1:["¡Sí!"],
				button_2:["Crudo no, a mi punto"],
			}
		},
		
		option_2:{
			copys:{
				copy_1:["Quien dice picante dice atrevido. Quien dice atrevido dice emprendedor. Quien dice emprendedor dice chef."],
				copy_2:["Tú controlas. Tú sabes que vichyssoise es una crema y no el nombre de mi gato 🍵👽"],
				copy_3:["¿Alguna vez te han criticado por cocinar lo mismo que ayer?"],
			},

			buttons:{
				button_1:["Muy sutilmente, sí"],
				button_2:["No se dan cuenta"],
			}
		},
		
		option_3:{
			copys:{
				copy_1:["Yo lo llamaría algo así como cocina con criterio. Si gusta a todo el mundo no gusta a nadie del todo 👻"],
				copy_2:["El que domina el ajo controla el criterio. Roza la disciplina zen 🧐"],
				copy_3:["¿Alguna vez te han criticado por hacer algo básico o facilón?"],
			},

			buttons:{
				button_1:["Pues sí, minimalismo"],
				button_2:["No, yo me complico"],
			}
		},
	},

	analysis:{
		copys:{
			copy_1:["Te veo muy bien, pero vamos a hacer un análisis rápido de la presentación de tus platos, ¿tienes alguna foto por ahí?"],
		},
		buttons:{
			button_1:["Enviar un plato 📸"],
		},
		option_1:{
			copys:{
				copy_1:["Tú si que sabes darle un aire al dente 🔝"],
				copy_2:["Fetén. Otro punto para Gryffindor✨"],
			},			
		},
		option_2:{
			copys:{
				copy_1:["El 32% de la comida de la nevera acaba tirándose a la basura. Vístelo de comida ecológica. Aunque ya sabrás que un 64% de la gente se inventa las estadísticas."],
				copy_2:["Encima dominas el arte del camuflaje. O del eco-camuflaje. Enhorabuena."],
			},
		},
		option_3:{
			copys:{
				copy_1:["Pues los imperios no se construyeron a base de esferificaciones. La postura histórica dará firmeza a tus obras."],
				copy_2:["Claro que sí 👏🏼👏🏼👏🏼 aunque recuerda que los imperios no se construyeron con esferificaciones."],
			},
		},
	},

	select_your_photo:{
		copys:{
			copy_1:["Mándame una foto de alguna de tus obras 🍳✨"]
		}
	},

	api_error:{
		copys:{
			copy_1:["Meeec 🚨 Los robots somos sentimientos y tenemos seres humanos. ¡Hay! Digo, me ha fallado el sistema. Vuélvelo a probar.",
			"Parece que tu foto es demasiado chula para mi sistema, no he podido contener tanta belleza. Probemos otra vez"]
		},

		buttons:{
			button_1:["¿Repetimos? ♻️"]
		}
	},

	error_on_select_photo:{
		copys:{
			copy_1:["He tenido un cortocircuito, intentémoslo de nuevo"]	
		}
	},

	choose_your_quote:{
		copys:{
			copy_1:["¡Wooow! estás hecho un cocinillas. Eres el master de tus platos. Para recordártelo te he vestido un poco tu plato."],
			copy_2:["Brillante, estás hecho un cocinillas. Para recordártelo te he vestido un lienzo en blanco con algunos titulares."],
			copy_3:["Elige una frase célebre para demostrar que ya eres cocinero ✅ y luce tu estilo culinario con la cabeza bien alta 🕺🏻"],
		},
		

		carrousel:{
			option_0:{
					id:["0"],
					title:['"No soy lento. Cocino a fuego lento"'],
					img_url:["https://koipe-images-2018.netlify.com/carrousel/carrousel_1.png"],
					button:["¡Soy yo!"]
				},
			option_1:{
					id:["1"],
					title:['"No hago ensaladas de col. Hago ensaladas Cool."'],
					img_url:["https://koipe-images-2018.netlify.com/carrousel/carrousel_2.png"],
					button:["100% mi esencia"]
				},
			option_2:{
					id:["2"],
					title:['"Mis platos no pican demasiado, Son atrevidos."'],
					img_url:["https://koipe-images-2018.netlify.com/carrousel/carrousel_3.png"],
					button:["Este es mi estilo"]
				},
			option_3:{
					id:["3"],
					title:['"Mis platos no son sosos. Son naturales, sin aditivo alguno"'],
					img_url:["https://koipe-images-2018.netlify.com/carrousel/carrousel_4.png"],
					button:["Ah no, este soy yo"]
				},
			option_4:{
					id:["upload_another_photo"],
					title:['Mejor otra foto'],
					img_url:["https://koipe-images-2018.netlify.com/carrousel/mejor_otro_plato.jpg"],
					button:["Mejor otra foto"]
				},
		},

		stickers:{
			
				option_0:{
					img_url:["https://koipe-images-2018.netlify.com/carrousel/sticker_carrousel_1.png"],	
				},
				option_1:{
					img_url:["https://koipe-images-2018.netlify.com/carrousel/sticker_carrousel_2.png"],	
				},
				option_2:{
					img_url:["https://koipe-images-2018.netlify.com/carrousel/sticker_carrousel_3.png"],	
				},
				option_3:{
					img_url:["https://koipe-images-2018.netlify.com/carrousel/sticker_carrousel_4.png"],	
				},												
		},
	
	},

	sos:{
		regex:["^(ayuda|help|auxilio|socorro|sos|emergencia|ayudame|emergencia|problema)(\\?|!|\\.|,|¿)*$"],
		copys:{
			copy_1:["Veo que te he liado, mea culpa. Volvemos a empezar, o sabes qué, para compensar… ¿quieres elegir la caja misteriosa? 🧞‍♂️"],
		},

		buttons:{
			button_1:["Volver a empezar"],
			button_2:["La caja misteriosa"]
		}			
	},

	go_back_intro:{
		copys:{
			copy_1:["Okay 🖖🏼🖖🏼🖖🏼 y ya sabes, si te repiensas lo de la caja o te pierdes puedes escribir SOS, pero venga va, empecemos por los principios. ¿Tienes cocina?"]
		},
		buttons:{
			button_1:["¡Por supuesto!"],
			button_2:["¡Ups! No..."]			
		}
	},

	mistery_box:{
		copys:{
			copy_1:["¡Yeah! 🎊 Abrimos caja sorpresa. No es una caja como tal, pero si una sorpresa. Redoble de tambores. Has ganado un análisis visual de tus platos. ¿tienes alguna foto de una de tus obras por ahí?"]
		},
		buttons:{
			button_1:["Enviar un plato 📸"],
		}		
	},

	save_your_photo:{
		copys:{
			copy_1:["Ahora guárdala en tu carrete y compártela con orgullo con el hashtag #tambiénsoycocinero"],
			copy_2:["Y ya sabes, si quieres más consejos puedes volver cuando quieras, y si no te dejo algunas otras opciones por aquí:"]
		},

		buttons:{
			button_1:["Volver al inicio"],
			button_2:["Compartir bot"],
			button_3:["Ver vídeo chulo"],
			button_4:["Subir otra foto"],						
		},
		
		default_images:{
			option_0:{
				img_url:["https://koipe-images-2018.netlify.com/carrousel/quote_1_m.png"]
			},
			option_1:{
				img_url:["https://koipe-images-2018.netlify.com/carrousel/quote_2_m.png"]
			},
			option_2:{
				img_url:["https://koipe-images-2018.netlify.com/carrousel/quote_3_m.png"]
			},
			option_3:{
				img_url:["https://koipe-images-2018.netlify.com/carrousel/quote_4_m.png"]
			}

		},

		stickers:{
			option_0:{
				img_url:['https://koipe-images-2018.netlify.com/save_photo/quote_1.png']
			},
			option_1:{
				img_url:['https://koipe-images-2018.netlify.com/save_photo/quote_2.png']
			},
			option_2:{
				img_url:['https://koipe-images-2018.netlify.com/save_photo/quote_3.png']
			},
			option_3:{
				img_url:['https://koipe-images-2018.netlify.com/save_photo/quote_4.png']
			}
		}
	},

	share_bot:{
		copys:{
			copy_1:["¡Oh! Qué orgullo y satisfacción. Espero que hayas tenido una grata experiencia. Y ya sabes, vuelve cuando quieras 💃🏻✨🏃🏻‍♂️🏃🏻‍♂️🏃🏻‍♂️🚶🏻‍♂️"],
			copy_2:["Te dejo la opción de volver a empezar."]
		},

		button:{
			copy_1:["Compartir"],
			copy_2:["Volver a empezar"]
		}
	},

	see_video:{
		copys:{
			copy_1:["Excelente. Ahí también dejé algunos de mis consejos, pero siempre entran mejor de forma visual 🔍"],
			copy_2:["Te dejo la opción de volver a empezar."]
		},
		button:{
			copy_1:["Ver vídeo"],
			url:['https://www.youtube.com/watch?v=-jj71RsCcUU'],
			copy_2:["Volver a empezar"]
		}
		
	},

	upload_another_photo:{
		option_1:{
			copys:{
				copy_1:["Qué perfeccionista. Like! Volvamos a probar."],
				copy_2:["Qué encuadre y qué ojo. Estrellas Michelín no sé pero likes tendrás por un tubo. Ahora puedes añadirle una cita y presumir de tu estilo culinario."],
				copy_3:["Brillante, estás hecho un cocinillas. Para recordártelo te he vestido un lienzo en blanco con algunos titulares."]
			},
			buttons:{
				button_1:["Enviar un plato 📸"],
			}
		},

		option_2:{
			copys:{
				copy_1:["Así me gusta, qué afán por conseguir la excelencia. ¡Otra vez!"],
				copy_2:["Este nuevo punto de vista engrandece las sombras, qué bien buscado. Ahora puedes añadirle una cita y hacértelo aún más tuyo."],
				copy_3:["Brillante, estás hecho un cocinillas. Para recordártelo te he vestido un lienzo en blanco con algunos titulares."]
			},
			buttons:{
				button_1:["Enviar un plato 📸"],
			}			
		}
	},

	retries:{
		copys:{
			copy_1:["Veeeeenga, sigamos con la cocina.", 
					"Sigamos con la belleza de tus platos.",
					"¡Sigamos!"
			],
		},
	},

    insults:{
    	option_1:{
    		regex:["^(puto|puta|zorra|perra|idiota|gilipollas|tonto|tonta|mamon|mamón|mamona|burro|burra|subnormal|hijoputa|hijaputa|hijo de puta|hija de puta|cabrón|cabron|cabrona|hostia|mierda|prostituta|prostitución|prostitucion|narcotráfico|narcotrafico|drogas|estupefacientes)$"],
    		copys:{
    			copy_1:["¡Epa! Creo que ha pasado un gato por tu teclado y ha escrito algo a sus anchas 🙀🙀🙀"],
    		},
    	},

    	option_2:{
    		regex:["^(imbécil|imbecil|joder|jodido|jodida|malnacido|malnacida|maricón|maricon|sarasa|bastardo|retrasado|retrasada|mongolo|monguer|capullo|arpía|arpía|coño|polla|caranchoa|cipote|cojón|cojon|cojones|caraculo|tontolculo|chupapollas|retino|gilipuertas)$"],
    		copys:{
    			copy_1:["Error 404 – mi alto grado de optimismo no ha encontrado tu piropo en el sistema."],
    		},
    	},
    	
    	option_3:{
    		regex:["^(huevón|huevon|lerdo|lameculos|malparido|malparida|palurdo|palurda|pardillo|pardilla|sabandija|tocapelotas|cafre|estúpido|estupido|estúpida|estupida|bobo|boba|miserable|desgraciado|desgraciada|putón|puton|sinvergüenza|sinverguenza|adefesio|alimaña|escoria|follar)$"],    			    			    			
    		copys:{
    			copy_1:["ñlskahfnpajxhñemf oh no, a mí también se me ha caído algo en el teclado."],
    		}, 		
    	},    	    	
    },

    not_found:{
    	copys:{
    		copy_1:["01010011 01101111 01110010 01110010 01111001, no te entiendo y supongo que tu tampoco has entendido el lenguaje binario, pero era una señal de disculpa. Soy un bot y tengo algunas limitaciones, sorry 💙",
    				"“perdóname si pido más de lo que puedo dar”, 💛 decía Camilo Sesto. Tú no pides más, pero yo soy un bot y no podré dar respuesta a todas tus peticiones.",
    				"Esto que dices tiene pinta de ser muy interesante, conmovedor, supongo. La lástima es que solo soy un robot 🤖 y no podré entender algunos de tus mensajes 💔"],
    		copy_2:["¿Qué quieres hacer?"]
    	},

		buttons:{
			button_1:["Volver al inicio"],
			button_2:["La caja misteriosa"]
		}	
    },

    greetings:{
    	regex:["^(hola|ola|ei|ep|ey|buenas|salud|hello|hi|hey|olis|cucut|que tal|que pasa|como va|como estas|que pasa)[?!.,¿]*$"],
    	copys:{
    		copy_1:["🖖🏼 ¡Buenas cocinillas! soy un chatbot consejero, así que volvamos al coach 🙃"]
    	}
    },

    good_morning:{
    	regex:["^(buenos días|buen día|buenos dias|wenos dias|bon dia)[?!.,¿]*$"],
    	copys:{
    		copy_1:["Buenos días masterchof. ¿Vienes desayunado? 😋"]
    	}
    },

    good_afternoon:{
    	regex:["^(buenas tardes|hora de la merienda|bona tarda)[?!.,¿]*$"],
    	copys:{
    		copy_1:["¡Buenas tardes! 👩🏽‍🍳 Hora de matar el gusanillo "]
    	}    	
    },

    good_night:{
    	regex:["^(buenas noches|a dormir|bona nit|hasta mañana)[?!.,¿]*$"],
    	copys:{
    		copy_1:["Que descanses bien. Y hasta mañana 💃🏻✨🏃🏻‍♂️🏃🏻‍♂️🏃🏻‍♂️🚶🏻‍♂️"]
    	}
    },

    gratitude:{
    	regex:["^(gràcies|gracies|moltes gràcies|estupendo|merci|perfecto|genial|gracias|cool|ok|val|vale|de acuerdo|oki|okis|👏|👍|👌)[?!.,¿]*$"],
    	copys:{
    		copy_1:["¡Qué simpatía desprendes! 👯‍♂️"]
    	}
    },

    good_bye:{
    	regex:["^(goodbye|good bye|adéu|adeu|deu|dew|dw|a10|chao|hasta luego|hasta otra|bye|adiós|adios|pues adiós)[?!.,¿]*$"],
    	copys:{
    		copy_1:["Y si no nos vemos: buenos días, buenas tardes y buenas noches!"]
    	}    	
    },

    gifs:{
    	gif_1:["https://koipe-images-2018.netlify.com/gifs/1_magic.gif"],
    	gif_2:["https://koipe-images-2018.netlify.com/gifs/2_yeah.gif"],
    	gif_3:["https://koipe-images-2018.netlify.com/gifs/3_tambien.gif"],
    	gif_4:["https://koipe-images-2018.netlify.com/gifs/4_gryffindor.gif"],
    	gif_5:["https://koipe-images-2018.netlify.com/gifs/5_soso.gif"],
    	gif_6:["https://koipe-images-2018.netlify.com/gifs/6_caja.gif"],
    	gif_7:["https://koipe-images-2018.netlify.com/gifs/7_gato.gif"],
    	gif_8:["https://koipe-images-2018.netlify.com/gifs/8_random.gif"],
    	gif_9:["https://koipe-images-2018.netlify.com/gifs/9_continue.gif"],
    	gif_10:["https://koipe-images-2018.netlify.com/gifs/10_proud.gif"],
    	gif_11:["https://koipe-images-2018.netlify.com/gifs/11_popcorn.gif"]
    }

}