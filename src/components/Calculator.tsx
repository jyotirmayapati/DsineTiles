import { useState, useEffect } from 'react'

type ProductType = "Solid Block" | "Paver" | "Kerbstone" | "Saucer Drain" | "U Drain" | "Precast Slab" | "Boundary Wall Panel" | "Precast Road";
type ConcreteGrade = "M7.5" | "M25" | "M30" | "M35" | "M40" | "Default";

interface FormErrors {
  quantity?: boolean;
  dim1?: boolean;
  dim2?: boolean;
  thickness?: boolean;
}

export default function Calculator() {
  const [product, setProduct] = useState<ProductType>('Solid Block')
  const [grade, setGrade] = useState<ConcreteGrade>('Default')
  const [dim1, setDim1] = useState('')
  const [dim2, setDim2] = useState('')
  const [thickness, setThickness] = useState('')
  const [quantity, setQuantity] = useState('')
  const [areaUnit, setAreaUnit] = useState('sqm')
  const [uDrainSize, setUDrainSize] = useState('300x300')
  const [results, setResults] = useState({
    co2: 0,
    water: 0,
    waste: 0,
    trees: 0,
    cars: 0,
    phones: 0,
    urbanDays: 0,
    ruralDays: 0
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Configuration data
  const UI_CONFIG = {
    "Solid Block": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Height (mm)", t_options: null },
    "Paver": { type: "area", t_label: "Thickness (mm)", t_options: [60, 80, 100] },
    "Kerbstone": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: null },
    "Saucer Drain": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: null },
    "U Drain": { type: "udrain", t_label: "Wall Thickness (mm)", t_options: [100, 125, 150] },
    "Precast Slab": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: [100, 125, 150, 200] },
    "Boundary Wall Panel": { type: "dims", l_label: "Length (mm)", w_label: "Height (mm)", t_label: "Thickness (mm)", t_options: [100, 125, 150] },
    "Precast Road": { type: "area", t_label: "Thickness (mm)", t_options: [125, 150, 175, 200, 250] },
  }

  const CEMENT_KG_PER_M3: Record<Exclude<ConcreteGrade, "Default">, number> = {
    "M7.5": 220, "M25": 320, "M30": 340, "M35": 380, "M40": 400
  }

  const DEFAULT_GRADE: Record<ProductType, Exclude<ConcreteGrade, "Default">> = {
    "Solid Block": "M7.5", "Paver": "M35", "Kerbstone": "M25",
    "Saucer Drain": "M25", "U Drain": "M30", "Precast Slab": "M30",
    "Boundary Wall Panel": "M30", "Precast Road": "M40"
  }

  // Constants
  const EF_CEMENT = 0.9
  const REDUCTION_FACTOR = 0.75
  const WATER_PER_M2_CURING = 70
  const URBAN_HH_L_PER_DAY = 540
  const RURAL_HH_L_PER_DAY = 220
  const EF_CAR_KM = 0.18
  const EF_TREE_PER_YEAR = 22
  const EF_PHONE_CHARGE = 0.0082

  const config = UI_CONFIG[product]

  // Reset form when product changes
  useEffect(() => {
    setDim1('')
    setDim2('')
    setThickness('')
    setErrors({})
  }, [product])

  // Calculate impact
  const calculateImpact = () => {
    const newErrors: FormErrors = {}

    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = true
    }

    if (config.type !== 'udrain' && (!dim1 || parseFloat(dim1) <= 0)) {
      newErrors.dim1 = true
    }

    if (config.type === 'dims' && (!dim2 || parseFloat(dim2) <= 0)) {
      newErrors.dim2 = true
    }

    if (!config.t_options && (!thickness || parseFloat(thickness) <= 0)) {
      newErrors.thickness = true
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please fill in all mandatory fields with valid numbers.")
      return
    }

    setErrors({})

    let selectedGrade = grade === "Default" ? DEFAULT_GRADE[product] : grade
    let total_volume_m3 = 0.0
    let total_curing_area_m2 = 0.0
    const qty = parseFloat(quantity) || 0

    if (product === "Solid Block" || product === "Kerbstone" || product === "Saucer Drain") {
      const L = (parseFloat(dim1) || 0) / 1000.0
      const B = (parseFloat(dim2) || 0) / 1000.0
      const H = (parseFloat(thickness) || 0) / 1000.0

      total_volume_m3 = (L * B * H) * qty
      total_curing_area_m2 = product === "Solid Block" ? (L * B) * qty : (L * H) * qty
    }
    else if (product === "Paver" || product === "Precast Road") {
      const areaVal = parseFloat(dim1) || 0
      const area_m2 = areaUnit === "sqft" ? areaVal * 0.092903 : areaVal
      const thickness_m = (parseFloat(thickness) || 0) / 1000.0

      total_volume_m3 = area_m2 * thickness_m
      total_curing_area_m2 = area_m2
    }
    else if (product === "U Drain") {
      const [inner_w_mm, inner_h_mm] = uDrainSize.split('x').map(parseFloat)
      const wall_mm = parseFloat(thickness) || 0
      const L_drain = 2.0

      const inner_w_m = inner_w_mm / 1000.0
      const inner_h_m = inner_h_mm / 1000.0
      const t_m = wall_mm / 1000.0

      const outer_w_m = inner_w_m + (2 * t_m)
      const outer_h_m = inner_h_m + t_m
      const section_area = (outer_w_m * outer_h_m) - (inner_w_m * inner_h_m)

      total_volume_m3 = section_area * L_drain * qty
      total_curing_area_m2 = (inner_w_m * L_drain) * qty
    }
    else if (product === "Precast Slab" || product === "Boundary Wall Panel") {
      const L = (parseFloat(dim1) || 0) / 1000.0
      const B = (parseFloat(dim2) || 0) / 1000.0
      const thick_m = (parseFloat(thickness) || 0) / 1000.0

      total_volume_m3 = (L * B * thick_m) * qty
      total_curing_area_m2 = (L * B) * qty
    }

    // Calculations
    const cement_per_m3 = CEMENT_KG_PER_M3[selectedGrade] || 340
    const cement_mass_kg = total_volume_m3 * cement_per_m3
    const conventional_co2_kg = cement_mass_kg * EF_CEMENT
    const co2_saved_kg = conventional_co2_kg * REDUCTION_FACTOR
    const co2_saved_tonnes = co2_saved_kg / 1000.0

    const water_saved_liters = total_curing_area_m2 * WATER_PER_M2_CURING
    const urban_days = water_saved_liters / URBAN_HH_L_PER_DAY
    const rural_days = water_saved_liters / RURAL_HH_L_PER_DAY

    const car_km = co2_saved_kg / EF_CAR_KM
    const trees = co2_saved_kg / EF_TREE_PER_YEAR
    const phones = co2_saved_kg / EF_PHONE_CHARGE
    const waste_tonnes = (cement_mass_kg * REDUCTION_FACTOR) / 1000.0

    setResults({
      co2: co2_saved_tonnes,
      water: Math.round(water_saved_liters),
      waste: waste_tonnes,
      trees: Math.round(trees),
      cars: Math.round(car_km),
      phones: Math.round(phones),
      urbanDays: urban_days,
      ruralDays: rural_days
    })
  }

  const resetCalculator = () => {
    setProduct('Solid Block')
    setGrade('Default')
    setDim1('')
    setDim2('')
    setThickness('')
    setQuantity('')
    setErrors({})
    setResults({
      co2: 0,
      water: 0,
      waste: 0,
      trees: 0,
      cars: 0,
      phones: 0,
      urbanDays: 0,
      ruralDays: 0
    })
  }

  const fmt = (val: number) => {
    let decimals = val > 0 && val < 0.01 ? 4 : 2
    return val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  return (
    <section className="py-12 px-4 lg:px-8 bg-linear-to-br from-stone-50 to-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-2xl px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14 bg-white border border-stone-200">

          {/* Header */}
          <div className="w-full mb-10">
            <div className="ornamental-line mb-6" />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              Carbon Impact <span className="italic">Calculator</span>
            </h2>
            <p className="font-body text-lg text-neutral-600 max-w-3xl">
              Compare traditional concrete with our eco-friendly precast products and see the environmental savings for your project
            </p>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Form */}
            <div className="w-full lg:w-1/2">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                {/* Product and Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value as ProductType)}
                      className="w-full border border-stone-300 rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white transition-all"
                    >
                      {Object.keys(UI_CONFIG).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                      Grade (Optional)
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as ConcreteGrade)}
                      className="w-full border border-stone-300 rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white transition-all"
                    >
                      <option value="Default">Default</option>
                      <option value="M7.5">M7.5</option>
                      <option value="M25">M25</option>
                      <option value="M30">M30</option>
                      <option value="M35">M35</option>
                      <option value="M40">M40</option>
                    </select>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dimension 1 */}
                  {config.type !== 'udrain' && (
                    <div>
                      <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                        {config.type === 'area' ? 'Area' : ('l_label' in config ? config.l_label : 'Length (mm)')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dim1}
                        onChange={(e) => setDim1(e.target.value)}
                        placeholder="0"
                        className={`w-full border ${errors.dim1 ? 'border-red-500' : 'border-stone-300'} rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all`}
                      />
                    </div>
                  )}

                  {config.type === 'udrain' && (
                    <div>
                      <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                        Internal Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={uDrainSize}
                        onChange={(e) => setUDrainSize(e.target.value)}
                        className="w-full border border-stone-300 rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white transition-all"
                      >
                        <option value="300x300">300 x 300 mm</option>
                        <option value="450x450">450 x 450 mm</option>
                        <option value="600x600">600 x 600 mm</option>
                      </select>
                    </div>
                  )}

                  {/* Dimension 2 */}
                  {config.type === 'dims' && (
                    <div>
                      <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                        {'w_label' in config ? config.w_label : 'Width (mm)'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={dim2}
                        onChange={(e) => setDim2(e.target.value)}
                        placeholder="0"
                        className={`w-full border ${errors.dim2 ? 'border-red-500' : 'border-stone-300'} rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all`}
                      />
                    </div>
                  )}

                  {config.type === 'area' && (
                    <div>
                      <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value)}
                        className="w-full border border-stone-300 rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white transition-all"
                      >
                        <option value="sqm">Square Meters (m²)</option>
                        <option value="sqft">Square Feet (ft²)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Thickness and Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                      {config.t_label} <span className="text-red-500">*</span>
                    </label>
                    {config.t_options ? (
                      <select
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        className="w-full border border-stone-300 rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 bg-white transition-all"
                      >
                        <option value="">Select...</option>
                        {config.t_options.map((opt) => (
                          <option key={opt} value={opt}>{opt} mm</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="mm"
                        className={`w-full border ${errors.thickness ? 'border-red-500' : 'border-stone-300'} rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all`}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-body font-semibold text-neutral-700 mb-2">
                      Quantity (Nos) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                      className={`w-full border ${errors.quantity ? 'border-red-500' : 'border-stone-300'} rounded-lg py-2.5 px-3 text-base font-body text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all`}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="button"
                    onClick={calculateImpact}
                    className="flex-1 bg-black text-white font-body font-semibold py-3 rounded-lg hover:bg-neutral-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                  >
                    Calculate Impact
                  </button>
                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="flex-1 bg-stone-100 border border-stone-300 text-neutral-700 font-body font-semibold py-3 rounded-lg hover:bg-stone-200 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="grid grid-cols-1 gap-4 sm:gap-5 mb-6">
                <div className="grid grid-cols-2 gap-2 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl py-6 px-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                  <span className="font-body font-semibold text-lg self-center">CO<sub>2</sub> saved</span>
                  <span className="font-display font-bold text-3xl text-right flex justify-end items-center">
                    {fmt(results.co2)}&nbsp;<span className="text-base font-body self-end mb-1">tonnes</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-linear-to-br from-blue-400 to-cyan-500 rounded-xl py-6 px-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                  <span className="font-body font-semibold text-lg self-center">Water saved</span>
                  <span className="font-display font-bold text-3xl text-right flex justify-end items-center">
                    {results.water.toLocaleString()}&nbsp;<span className="text-base font-body self-end mb-1">litres</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl py-6 px-5 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
                  <span className="font-body font-semibold text-lg self-center">Industrial waste used</span>
                  <span className="font-display font-bold text-3xl text-right flex justify-end items-center">
                    {fmt(results.waste)}&nbsp;<span className="text-base font-body self-end mb-1">tonnes</span>
                  </span>
                </div>
              </div>

              {/* Equivalents */}
              <div className="bg-linear-to-br from-stone-50 to-neutral-100 rounded-xl py-6 px-6 border border-stone-200 shadow-md">
                <h3 className="font-display font-bold text-xl text-neutral-900 mb-4">Environmental Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌳</span>
                    <p className="font-body text-neutral-700 leading-relaxed">
                      Equivalent to planting <span className="font-bold text-green-600">{results.trees.toLocaleString()}</span> trees per year
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚗</span>
                    <p className="font-body text-neutral-700 leading-relaxed">
                      Comparable to eliminating <span className="font-bold text-green-600">{results.cars.toLocaleString()}</span> km of car travel
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <p className="font-body text-neutral-700 leading-relaxed">
                      Equal to <span className="font-bold text-green-600">{results.phones.toLocaleString()}</span> smartphone charges
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💧</span>
                    <p className="font-body text-neutral-700 leading-relaxed">
                      Water for <span className="font-bold text-blue-600">{results.urbanDays.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span> days (Urban) or{' '}
                      <span className="font-bold text-blue-600">{results.ruralDays.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span> days (Rural) households
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
