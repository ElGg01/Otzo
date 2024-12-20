from flask import request, jsonify, Response
from . import reportes_bp
from src.services.reportes.reportesService import *
from src.db import get_connection
from src.utils.Logger import Logger
from pymysql.cursors import DictCursor
from datetime import datetime

# ---------------------------------------------------------------------------------------------------------------------------

#Ruta para saber si está funcionando nuestra API
@reportes_bp.route("/", methods=["GET"])
def index():
    try:
        return jsonify({"mensaje": "Hola - Reportes"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-puntos", methods=["GET"])
def generar_reporte_puntos():
    """
    Genera un reporte de puntos para todos los clientes.
    """
    try:
        reporte = ReportesService.crear_reporte_puntos()
        return jsonify(reporte), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-ventas", methods=["GET"])
def generar_reporte_ventas():
    """
    Genera un reporte de ventas con los campos requeridos.
    """
    try:
        conexion = get_connection()
        cursor = conexion.cursor(DictCursor)

        cursor.execute("""
            SELECT v.id_venta, v.fecha_venta, v.total_venta, dv.nombre_producto
            FROM ventas v
            JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
        """)
        ventas = cursor.fetchall()

        if not ventas:
            return jsonify({"mensaje": "No se encontraron ventas registradas."}), 200

        return jsonify(ventas), 200
    except Exception as e:
        return jsonify({"error": f"Error al generar el reporte de ventas: {str(e)}"}), 500
    finally:
        if 'conexion' in locals():
            conexion.close()

# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-rangos", methods=["GET"])
def generar_reporte_rangos():
    """
    Genera un reporte con los rangos y la cantidad de clientes en cada uno.
    """
    conexion = get_connection()
    try:
        with conexion.cursor(DictCursor) as cursor:
            query = """
                SELECT r.nombre_rango, COUNT(p.idclientes_puntos) AS total_personas
                FROM rangos r
                LEFT JOIN puntos p ON p.idrango = r.idrango
                GROUP BY r.nombre_rango
                ORDER BY total_personas DESC
            """
            cursor.execute(query)
            resultado = cursor.fetchall()
            return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": f"Error al generar el reporte: {str(e)}"}), 500
    finally:
        conexion.close()

# linea 65 where > on 
# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-administracion", methods=["GET"])
def generar_reporte_administracion():
    """
    Genera un reporte con las áreas de trabajo, el número de empleados en cada una,
    y los ID de los empleados.
    """
    conexion = get_connection()
    try:
        with conexion.cursor(DictCursor) as cursor:
            query = """
                SELECT 
                    area_Trabajo AS area,
                    COUNT(id_empleado) AS total_empleados,
                    GROUP_CONCAT(id_empleado) AS empleados
                FROM administracion
                GROUP BY area_Trabajo
                ORDER BY total_empleados DESC
            """
            cursor.execute(query)
            resultado = cursor.fetchall()
            return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": f"Error al generar el reporte: {str(e)}"}), 500
    finally:
        conexion.close()

# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-quejas", methods=["GET"])
def generar_reporte_quejas():
    """
    Genera un reporte de quejas agrupadas por categoría.
    """
    try:
        reporte = ReportesService.crear_reporte_quejas()
        return jsonify(reporte), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------------------------------------------------------------------------

@reportes_bp.route("/reporte-inventario", methods=["GET"])
def generar_reporte_inventario():
    """
    Genera un reporte del inventario.
    """
    try:
        reporte = ReportesService.crear_reporte_inventario()
        return jsonify(reporte), 200
    except Exception as e:
        return jsonify({"error": f"Error al generar el reporte de inventario: {str(e)}"}), 500
