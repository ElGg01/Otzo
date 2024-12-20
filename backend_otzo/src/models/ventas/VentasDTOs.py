from dataclasses import dataclass
from datetime import datetime


@dataclass
class DetalleVentaDTO:
    _nombre_producto: str
    _codigo_producto: str = None
    _categoria_producto: str = None
    _id_producto: int = None
    _precio_unitario: float = 0
    _devuelto: bool = False
    _id_venta: int = None
    _id_detalle_venta: int = None

    @property
    def id_producto(self) -> int:
        return self._id_producto

    @id_producto.setter
    def id_producto(self, value: int):
        if not isinstance(value, int):
            raise TypeError("id_producto debe ser un entero. Error en DTO.")
        self._id_producto = value

    @property
    def id_detalle_venta(self) -> int:
        return self._id_detalle_venta

    @id_detalle_venta.setter
    def id_detalle_venta(self, value: int):
        if not isinstance(value, int):
            raise TypeError("id_detalle_venta debe ser un entero. Error en DTO.")
        self._id_detalle_venta = value

    @property
    def id_venta(self) -> int:
        return self._id_venta

    @id_venta.setter
    def id_venta(self, value: int):
        if not isinstance(value, int):
            raise TypeError("id_venta debe ser un entero. Error en DTO.")
        self._id_venta = value

    @property
    def nombre_producto(self) -> str:
        return self._nombre_producto

    @nombre_producto.setter
    def nombre_producto(self, value: str):
        if not isinstance(value, str):
            raise TypeError("nombre_producto debe ser una cadena. Error en DTO.")
        if len(value) == 0:
            raise ValueError("El nombre del producto debe tener al menos 1 caracter")
        self._nombre_producto = value

    @property
    def codigo_producto(self) -> str:
        return self._codigo_producto

    @codigo_producto.setter
    def codigo_producto(self, value: str):
        if not isinstance(value, str):
            raise TypeError("nombre_producto debe ser una cadena. Error en DTO.")
        if len(value) == 0:
            raise ValueError("El código del producto debe tener al menos 1 caracter")
        self._codigo_producto = value

    @property
    def precio_unitario(self) -> float:
        return self._precio_unitario

    @precio_unitario.setter
    def precio_unitario(self, value: float):
        if not isinstance(value, float):
            raise TypeError("precio_unitario debe ser un float. Error en DTO.")
        if value < 0:
            raise ValueError("El precio unitario no puede ser negativo")
        self._precio_unitario = value

    @property
    def categoria_producto(self) -> str:
        return self._categoria_producto

    @categoria_producto.setter
    def categoria_producto(self, value: str):
        if not isinstance(value, str):
            raise TypeError("categoria_producto debe ser una cadena. Error en DTO.")
        if len(value) == 0:
            raise ValueError("La categoría del producto debe tener al menos 1 caracter")
        self._categoria_producto = value

    @property
    def devuelto(self) -> bool:
        return self._devuelto

    @devuelto.setter
    def devuelto(self, value: bool):
        if not isinstance(value, bool):
            raise TypeError("devuelto debe ser un boolean. Error en DTO.")
        self._devuelto = value


@dataclass
class VentaDTO:
    _monto_recibido: float
    _fecha_venta: datetime
    _metodo_pago: str
    _id_cliente: int
    _id_empleado: int
    _total_venta: float
    _detalles_venta: list[DetalleVentaDTO] = None
    _id_venta: int = None

    @property
    def id_venta(self) -> int:
        return self._id_venta

    @id_venta.setter
    def id_venta(self, value: int) -> None:
        if not isinstance(value, int):
            raise TypeError("id_venta debe ser un int. Error en DTO.")
        self._id_venta = value

    @property
    def monto_recibido(self) -> float:
        return self._monto_recibido

    @monto_recibido.setter
    def monto_recibido(self, value: float) -> None:
        if not isinstance(value, float):
            raise TypeError("monto_recibido debe ser un float. Error en DTO.")
        self._monto_recibido = value

    @property
    def total_venta(self) -> float:
        return self._total_venta

    @total_venta.setter
    def total_venta(self, value: float) -> None:
        if not isinstance(value, float):
            raise TypeError("total_venta debe ser un int. Error en DTO.")
        if value < 0:
            raise ValueError("El total de la venta no puede ser negativo")
        self._total_venta = value

    @property
    def fecha_venta(self) -> datetime:
        return self._fecha_venta

    @fecha_venta.setter
    def fecha_venta(self, value: datetime) -> None:
        if not isinstance(value, datetime):
            raise TypeError("fecha_venta debe ser un datetime. Error en DTO.")
        if value < datetime.now():
            raise ValueError("La fecha de venta no puede ser anterior a la actual")
        self._fecha_venta = value

    @property
    def metodo_pago(self) -> str:
        return self._metodo_pago

    @metodo_pago.setter
    def metodo_pago(self, value: str):
        if not isinstance(value, str):
            raise TypeError("metodo_pago debe ser una cadena. Error en DTO.")
        if value not in ["efectivo", "tarjeta", "puntos"]:
            raise ValueError("Método de pago no válido")
        self._metodo_pago = value

    @property
    def id_cliente(self) -> int:
        return self._id_cliente

    @id_cliente.setter
    def id_cliente(self, value: int):
        if not isinstance(value, int):
            raise TypeError("id_cliente debe ser un int. Error en DTO.")
        self._id_cliente = value

    @property
    def id_empleado(self) -> int:
        return self._id_empleado

    @id_empleado.setter
    def id_empleado(self, value: int):
        if not isinstance(value, int):
            raise TypeError("id_empleado debe ser un int. Error en DTO.")
        self._id_empleado = value

    @property
    def detalles_venta(self) -> list:
        return self._detalles_venta

    @detalles_venta.setter
    def detalles_venta(self, value: DetalleVentaDTO):
        self._detalles_venta.append(value)
