export default function ExpiredDevices() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/devices`)
      .then(res => {

        const now = new Date();

        const expired = res.data.filter(d => {
          if (!d.installDate || !d.lifespan) return false;

          const exp = new Date(d.installDate);
          exp.setFullYear(exp.getFullYear() + d.lifespan);

          return exp < now;
        });

        setData(expired);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-red-500">
        ⛔ Thiết bị hết hạn
      </h1>

      <Table data={data} />
    </div>
  );
}
