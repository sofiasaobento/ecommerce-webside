const configuracion = {
	moneda: "$",
	costoEnvio: 300,
	costoFinanciación: (costo) => costo * 0.1
};

const items = [{
	id: 'ccu',
	titulo: "Campera contraste urbana",
	stock: 10,
	precio: 1300,
	promocion3x2: false
}, {
	id: 'ztd',
	titulo: "Zapatillas textura diagonal",
	stock: 10,
	precio: 2800,
	promocion3x2: true
}, {
	id: 'bgb',
	titulo: "Bufanda gris basica",
	stock: 10,
	precio: 400,
	promocion3x2: false
}, {
	id: 'mcs',
	titulo: "Mochila cuero simple",
	stock: 10,
	precio: 4500,
	promocion3x2: false
}];

const usuario = {
	nombre: "Francisco",
	apellido: "López",
	email: "info@rocketcode.com.ar"
};

const obtenerNombre = (user) => {
	// return user.nombre + ' ' + userr.apellido;
	return `${user.nombre} ${user.apellido}`;
};

const precioFormateado = (moneda, precio) => {
	// return moneda + ' ' + precio;
	return `${moneda} ${precio}`;
};

const obtenerTotal = (subTotal, envio, financiacion, promocion3x2, codigoCupon) => {
	return subTotal + envio + financiacion + promocion3x2 + codigoCupon;
}

const calcularCostoEnvio = (subTotal, costoEnvio) => {
	if (subTotal >= 8000) {
		return 0;
	}

	return costoEnvio;
}

const calcularReintegroPromo3x2 = (id, cantidad) => {
	const item = items.find((item) => item.id === id)
	const cantidadaPromos = parseInt(cantidad / 3);

	if (item.promocion3x2) {
		if (cantidadaPromos > 0) {
			return item.precio * cantidadaPromos;
		}
	}

	return 0;
}

const calcularReintegroPromo3x2Pedido = (items) => {
	if (!items.length) return 0;

	const total = items.map(item => {
		const reintegroPromo3x2 = calcularReintegroPromo3x2(item.id, item.cantidad);
		return reintegroPromo3x2;
	}).reduce((total, reintegro) => {
		return total + reintegro
	});

	return total
}

const calcularDescuentoCupon = (subTotal, cupon) => {
	if (cupon === "DESCUENTO20%") {
		return subTotal * 0.2
	} else if (cupon === "DESCUENTO10%") {
		return subTotal * 0.1
	}

	return 0
}

const actualizarElementoDOM = (id, texto) => {
	const elemento = obtenerElementoDOM(id);
	elemento.innerHTML = texto
}

const obtenerElementoDOM = (id) => {
	return document.getElementById(id)
}

const obtenerItemsDOM = () => {
	return document.querySelectorAll("#items > tr");
}

const obtenerCantidadDOM = (id) => {
	return document.querySelector(`#${id} .quantity__item input`).value;
}

const obtenerYActualizar = () => {
	const itemsDOM = obtenerItemsDOM();
	const data = [];

	itemsDOM.forEach(itemDOM => {
		const item = items.find((item) => item.id === itemDOM.id)
		const cantidad = obtenerCantidadDOM(itemDOM.id)
		
		actualizarElementoPrecioDOM(`${item.id}-precio`, item.precio)
		actualizarElementoPrecioDOM(`${item.id}-total`, item.precio * cantidad)
		
		data.push({
			id: item.id,
			titulo: item.titulo,
			stock: item.stock,
			precio: item.precio,
			promocion3x2: item.promocion3x2,
			cantidad: cantidad
		});
	});

	return data;
}

const actualizarElementoPrecioDOM = (id, precio) => {
	const elemento = obtenerElementoDOM(id);
	elemento.innerHTML = precioFormateado(configuracion.moneda, precio)
	elemento.parentNode.style.display = null;

	if (precio < 0) {
		elemento.classList.add("precio-positivo")
	} else if (precio === 0) {
		elemento.parentNode.style.display = "none";;
	} else {
		elemento.classList.remove("precio-positivo")
	}
}

const calcularSubTotal = (items) => {
	return items.map(item => {
		return item.precio * item.cantidad
	}).reduce((total, precio) => {
		return total + precio
	});
}

const valorPositivo = (valor) => {
	return valor * -1;
}

const aplicarCupon = () => {
	const items = obtenerYActualizar();
	const subTotal = calcularSubTotal(items);
	const envio = calcularCostoEnvio(subTotal, configuracion.costoEnvio);
	const financiacion = configuracion.costoFinanciación(subTotal);
	const promocion3x2 = valorPositivo(calcularReintegroPromo3x2Pedido(items));
	const cupon = obtenerElementoDOM("cupon").value;
	const codigoCupon = valorPositivo(calcularDescuentoCupon(subTotal, cupon));
	const total = obtenerTotal(subTotal, envio, financiacion, promocion3x2, codigoCupon);

	actualizarElementoPrecioDOM("subtotal", subTotal);
	actualizarElementoPrecioDOM("costoEnvio", envio);
	actualizarElementoPrecioDOM("costoFinanciacion", financiacion);
	actualizarElementoPrecioDOM("promocion3x2", promocion3x2);
	actualizarElementoPrecioDOM("codigoCupon", codigoCupon);
	actualizarElementoPrecioDOM("total", total);
}

const init = () => {
	const nombreCompleto = obtenerNombre(usuario);
	const items = obtenerYActualizar();
	const subTotal = calcularSubTotal(items);
	const envio = calcularCostoEnvio(subTotal, configuracion.costoEnvio);
	const financiacion = configuracion.costoFinanciación(subTotal);
	const promocion3x2 = valorPositivo(calcularReintegroPromo3x2Pedido(items));
	const cupon = obtenerElementoDOM("cupon").value;
	const codigoCupon = valorPositivo(calcularDescuentoCupon(subTotal, cupon));
	const total = obtenerTotal(subTotal, envio, financiacion, promocion3x2, codigoCupon);

	actualizarElementoDOM("nombre", nombreCompleto);
	actualizarElementoPrecioDOM("subtotal", subTotal);
	actualizarElementoPrecioDOM("costoEnvio", envio);
	actualizarElementoPrecioDOM("costoFinanciacion", financiacion);
	actualizarElementoPrecioDOM("promocion3x2", promocion3x2);
	actualizarElementoPrecioDOM("codigoCupon", codigoCupon);
	actualizarElementoPrecioDOM("total", total);
}

init();
