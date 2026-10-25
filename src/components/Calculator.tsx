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
  const [calculated, setCalculated] = useState(false)

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

    setCalculated(true)
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
    setCalculated(false)
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

  const hasErrors = Object.keys(errors).length > 0
  const days = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <section id="impact" className="py-24 sm:py-32 border-t border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-end">
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">Carbon calculator</h2>
          <p className="text-lg text-aggregate max-w-lg lg:justify-self-end">
            Pick a product and enter your quantities to see what our lower-carbon precast saves against conventional concrete.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <form className="bg-slab border border-formline rounded-[4px] p-6 sm:p-8 space-y-6 self-start" onSubmit={(e) => { e.preventDefault(); calculateImpact() }} noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="calc-product" className="field-label">Product</label>
                <select id="calc-product" value={product} onChange={(e) => setProduct(e.target.value as ProductType)} className="field">
                  {Object.keys(UI_CONFIG).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="calc-grade" className="field-label">Concrete grade <span className="font-normal text-aggregate">(optional)</span></label>
                <select id="calc-grade" value={grade} onChange={(e) => setGrade(e.target.value as ConcreteGrade)} className="field">
                  <option value="Default">Typical for this product</option>
                  {['M7.5', 'M25', 'M30', 'M35', 'M40'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {config.type === 'udrain' ? (
                <div>
                  <label htmlFor="calc-udrain" className="field-label">Internal size</label>
                  <select id="calc-udrain" value={uDrainSize} onChange={(e) => setUDrainSize(e.target.value)} className="field">
                    <option value="300x300">300 × 300 mm</option>
                    <option value="450x450">450 × 450 mm</option>
                    <option value="600x600">600 × 600 mm</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="calc-dim1" className="field-label">
                    {config.type === 'area' ? 'Area' : ('l_label' in config ? config.l_label : 'Length (mm)')}
                  </label>
                  <input id="calc-dim1" type="number" inputMode="decimal" step="0.01" min="0" value={dim1} onChange={(e) => setDim1(e.target.value)} placeholder="0" aria-invalid={!!errors.dim1} className="field tabular" />
                </div>
              )}

              {config.type === 'dims' && (
                <div>
                  <label htmlFor="calc-dim2" className="field-label">{'w_label' in config ? config.w_label : 'Width (mm)'}</label>
                  <input id="calc-dim2" type="number" inputMode="decimal" step="0.01" min="0" value={dim2} onChange={(e) => setDim2(e.target.value)} placeholder="0" aria-invalid={!!errors.dim2} className="field tabular" />
                </div>
              )}

              {config.type === 'area' && (
                <div>
                  <label htmlFor="calc-unit" className="field-label">Unit</label>
                  <select id="calc-unit" value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className="field">
                    <option value="sqm">Square metres (m²)</option>
                    <option value="sqft">Square feet (ft²)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="calc-thickness" className="field-label">{config.t_label}</label>
                {config.t_options ? (
                  <select id="calc-thickness" value={thickness} onChange={(e) => setThickness(e.target.value)} aria-invalid={!!errors.thickness} className="field">
                    <option value="">Choose</option>
                    {config.t_options.map((opt) => <option key={opt} value={opt}>{opt} mm</option>)}
                  </select>
                ) : (
                  <input id="calc-thickness" type="number" inputMode="decimal" min="0" value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="mm" aria-invalid={!!errors.thickness} className="field tabular" />
                )}
              </div>
              <div>
                <label htmlFor="calc-qty" className="field-label">Quantity (pieces)</label>
                <input id="calc-qty" type="number" inputMode="numeric" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" aria-invalid={!!errors.quantity} className="field tabular" />
              </div>
            </div>

            {hasErrors && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                Fill in the highlighted fields with numbers above zero.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-mark">Calculate savings</button>
              <button type="button" onClick={resetCalculator} className="btn-line">Reset</button>
            </div>
          </form>

          <div className={`transition-opacity duration-500 ${calculated ? '' : 'opacity-45'}`} aria-live="polite">
            <dl className="divide-y divide-formline border-y border-formline">
              {[
                { label: 'CO₂ saved', value: fmt(results.co2), unit: 'tonnes' },
                { label: 'Water saved', value: results.water.toLocaleString(), unit: 'litres' },
                { label: 'Industrial waste put to use', value: fmt(results.waste), unit: 'tonnes' },
              ].map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-6 py-6">
                  <dt className="text-aggregate">{r.label}</dt>
                  <dd className="text-right">
                    <span className="type-display text-3xl sm:text-4xl tabular">{r.value}</span>
                    <span className="ml-2 text-aggregate">{r.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-10 type-wide text-xl">That is about the same as</h3>
            <ul className="mt-4 space-y-3 text-aggregate">
              <li><strong className="text-graphite tabular">{results.trees.toLocaleString()}</strong> trees absorbing carbon for a year</li>
              <li><strong className="text-graphite tabular">{results.cars.toLocaleString()}</strong> km of car travel avoided</li>
              <li><strong className="text-graphite tabular">{results.phones.toLocaleString()}</strong> smartphone charges</li>
              <li>
                Household water for <strong className="text-graphite tabular">{days(results.urbanDays)}</strong> days in a city
                or <strong className="text-graphite tabular">{days(results.ruralDays)}</strong> days in a village
              </li>
            </ul>
            {!calculated && <p className="mt-8 text-sm text-aggregate">Your results appear here after you calculate.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
