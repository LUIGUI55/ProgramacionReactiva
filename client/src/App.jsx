import { useState, useEffect } from 'react';
import { Trash2, Plus, Thermometer, Droplets, Sun, Activity, Search } from 'lucide-react';
import './App.css';

function App() {
  const [sensores, setSensores] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', tipo: '', valor: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    cargarSensores();
  }, []);

  const cargarSensores = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/sensores');
      if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
      const datos = await respuesta.json();
      setSensores(datos);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const agregarSensor = async (e) => {
    e.preventDefault();
    if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
      alert("Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    try {
      const respuesta = await fetch('/api/sensores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      if (!respuesta.ok) throw new Error("Error al crear sensor");
      setFormulario({ nombre: '', tipo: '', valor: '' });
      cargarSensores();
    } catch (err) {
      alert("Error al agregar el sensor");
    } finally {
      setCargando(false);
    }
  };

  const eliminarSensor = async (id) => {
    if (!confirm(`¿Eliminar ${sensores.find(s => s.id === id)?.nombre}?`)) return;
    try {
      await fetch(`/api/sensores/${id}`, { method: 'DELETE' });
      cargarSensores();
    } catch (err) {
      alert("Error al eliminar el sensor");
    }
  };

  const sensoresFiltrados = filtroTipo === 'todos'
    ? sensores
    : sensores.filter(s => s.tipo === filtroTipo);

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'Temperatura': return <Thermometer className="icon-sensor hot" />;
      case 'Humedad': return <Droplets className="icon-sensor humid" />;
      case 'Luz': return <Sun className="icon-sensor light" />;
      default: return <Activity className="icon-sensor" />;
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header>
          <div className="brand">
            <Activity className="brand-icon" size={32} />
            <h1>SensorFlow</h1>
          </div>
          <p className="subtitle">Monitoreo Reactivo en Tiempo Real</p>
        </header>

        <main>
          <section className="control-panel">
            <form onSubmit={agregarSensor} className="add-form">
              <div className="input-group">
                <input
                  name="nombre"
                  placeholder="Nombre del sensor"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="input-group">
                <select name="tipo" value={formulario.tipo} onChange={manejarCambio} required>
                  <option value="">Seleccionar Tipo...</option>
                  <option value="Temperatura">Temperatura</option>
                  <option value="Humedad">Humedad</option>
                  <option value="Luz">Luz</option>
                </select>
              </div>

              <div className="input-group">
                <input
                  name="valor"
                  type="number"
                  placeholder="Valor"
                  value={formulario.valor}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <button type="submit" disabled={cargando} className="btn-primary">
                <Plus size={18} />
                {cargando ? 'Agregando...' : 'Agregar Sensor'}
              </button>
            </form>

            <div className="filter-bar">
              <Search size={18} className="filter-icon" />
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="filter-select">
                <option value="todos">Todos los sensores</option>
                <option value="Temperatura">Temperatura</option>
                <option value="Humedad">Humedad</option>
                <option value="Luz">Luz</option>
              </select>
            </div>
          </section>

          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="grid-sensores">
            {sensoresFiltrados.map((sensor) => (
              <article key={sensor.id} className="sensor-card fade-in">
                <div className="card-header">
                  {getIcon(sensor.tipo)}
                  <button onClick={() => eliminarSensor(sensor.id)} className="btn-icon delete">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-body">
                  <h3>{sensor.nombre}</h3>
                  <div className="sensor-value">
                    <span className="value">{sensor.valor}</span>
                    <span className="unit">
                      {sensor.tipo === 'Temperatura' ? '°C' : sensor.tipo === 'Humedad' ? '%' : 'lux'}
                    </span>
                  </div>
                  <span className="sensor-type">{sensor.tipo}</span>
                </div>
              </article>
            ))}

            {sensoresFiltrados.length === 0 && (
              <div className="empty-state">
                <p>No hay sensores activos</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="background-decor"></div>
    </div>
  );
}

export default App;
