from flask import Blueprint, jsonify
from reportesModels import obtener_reporte_mas_reciente
from reportesDTO import ReporteDTO

# Crear un Blueprint para las rutas de reportes
reportes_bp = Blueprint('reportes', __name__)

@reportes_bp.route('/api/reporte_diario', methods=['GET'])
def obtener_reporte_diario():
    """Devuelve el último reporte generado."""
    reporte_db = obtener_reporte_mas_reciente()
    
    if not reporte_db:
        return jsonify({"mensaje": "No hay reportes disponibles"}), 404

    reporte = ReporteDTO(
        fecha_generacion=reporte_db["fecha_generacion"],
        clientes=json.loads(reporte_db["reporte"])
    )
    return jsonify(reporte.to_dict())