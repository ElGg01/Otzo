import json

class ReporteDTO:
    """DTO para los reportes diarios de puntos."""
    def __init__(self, fecha_generacion=None, clientes=None):
        self._fecha_generacion = fecha_generacion
        self._clientes = clientes or []

    # Getters
    @property
    def fecha_generacion(self):
        return self._fecha_generacion

    @property
    def clientes(self):
        return self._clientes

    # Setters
    @fecha_generacion.setter
    def fecha_generacion(self, value):
        self._fecha_generacion = value

    @clientes.setter
    def clientes(self, value):
        self._clientes = value

    def to_dict(self):
        return {
            "fecha_generacion": self._fecha_generacion,
            "clientes": self._clientes
        }

    def to_json(self):
        return json.dumps(self.to_dict())
    
    import json

class VentaDTO:
    """DTO para los reportes diarios de ventas."""
    def __init__(self, id_venta=None, total_venta=0, fecha_venta=None, cliente=None, empleado=None, detalles=None):
        self._id_venta = id_venta
        self._total_venta = total_venta
        self._fecha_venta = fecha_venta
        self._cliente = cliente
        self._empleado = empleado
        self._detalles = detalles or []

    @property
    def id_venta(self):
        return self._id_venta

    @id_venta.setter
    def id_venta(self, value):
        self._id_venta = value

    @property
    def total_venta(self):
        return self._total_venta

    @total_venta.setter
    def total_venta(self, value):
        self._total_venta = value

    @property
    def fecha_venta(self):
        return self._fecha_venta

    @fecha_venta.setter
    def fecha_venta(self, value):
        self._fecha_venta = value

    @property
    def cliente(self):
        return self._cliente

    @cliente.setter
    def cliente(self, value):
        self._cliente = value

    @property
    def empleado(self):
        return self._empleado

    @empleado.setter
    def empleado(self, value):
        self._empleado = value

    @property
    def detalles(self):
        return self._detalles

    @detalles.setter
    def detalles(self, value):
        self._detalles = value

    def to_dict(self):
        return {
            "id_venta": self._id_venta,
            "total_venta": self._total_venta,
            "fecha_venta": self._fecha_venta,
            "cliente": self._cliente,
            "empleado": self._empleado,
            "detalles": self._detalles,
        }

    def to_json(self):
        return json.dumps(self.to_dict())
