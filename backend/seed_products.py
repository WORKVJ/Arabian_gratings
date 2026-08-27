import os
import sys
import django
import shutil
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.append(str(Path(__file__).resolve().parent))
django.setup()

from apps.products.models import Media, Document, ProductCategory, Product, ProductImage, ProductSpecification
from apps.industries.models import Industry

def seed():
    print("Starting product database seed...")
    
    # 1. Define files to copy from frontend public to backend media
    src_dir = Path("../frontend/public")
    dest_dir = Path("media/uploads/2026/08")
    os.makedirs(dest_dir, exist_ok=True)
    
    files_to_copy = [
        "product-steel-grating.jpg",
        "product-frp-grating.jpg",
        "product-ss-grating.jpg",
        "product-aluminium-grating.jpg",
        "product-manhole-cover.jpg",
        "product-grating-clamp.jpg",
        "product-step-iron.jpg",
        "product-tactile-stud.jpg",
        "facility-overview.jpg",
        "hero-industrial.jpg",
        "industry-oilgas.jpg",
        "project-marine.jpg",
        "project-refinery.jpg",
        "cta-factory.jpg"
    ]
    
    media_objs = {}
    for filename in files_to_copy:
        src_path = src_dir / filename
        dest_path = dest_dir / filename
        if src_path.exists():
            shutil.copy(src_path, dest_path)
            # Create Media object pointing to the copied file
            relative_db_path = f"uploads/2026/08/{filename}"
            media, created = Media.objects.get_or_create(
                file=relative_db_path,
                defaults={
                    "title": filename.split('.')[0].replace('-', ' ').title(),
                    "alt_text": f"High quality {filename.split('.')[0].replace('-', ' ')} asset",
                    "caption": f"Arabian Gratings {filename.split('.')[0].replace('-', ' ')} description"
                }
            )
            media_objs[filename] = media
            print(f"Copied and registered media: {filename}")
        else:
            print(f"Warning: Source image {src_path} not found!")

    # Fallback to any created media or first if not found
    default_media = list(media_objs.values())[0] if media_objs else None
    
    # Clean existing product data to avoid duplicate clashes
    ProductSpecification.objects.all().delete()
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    ProductCategory.objects.all().delete()
    
    # 2. Categories mapping based on client-provided list
    categories_data = [
        {"name": "FRP/GRP Products", "slug": "frp-grp-products", "short": "Corrosion-resistant fiberglass reinforced plastic floor grids and structural products.", "img": "product-frp-grating.jpg"},
        {"name": "Steel Gratings", "slug": "steel-gratings", "short": "Heavy-duty electroforge welded carbon steel floor gratings galvanized for extreme load spans.", "img": "product-steel-grating.jpg"},
        {"name": "Stainless Steel Products", "slug": "stainless-steel-products", "short": "Premium hygiene-safe SS304/SS316 grating panels for food processing and marine decks.", "img": "product-ss-grating.jpg"},
        {"name": "Aluminium", "slug": "aluminium", "short": "Lightweight, non-sparking walkways, access grates and stair steps.", "img": "product-aluminium-grating.jpg"},
        {"name": "Manhole", "slug": "manhole", "short": "Ductile iron and GRP heavy-load manhole access covers for roads and infrastructure.", "img": "product-manhole-cover.jpg"},
        {"name": "SS/GI Grating Clamps", "slug": "ss-gi-grating-clamps", "short": "Secure installation fasteners, clamps, and clips for structural mounting.", "img": "product-grating-clamp.jpg"},
        {"name": "Step Iron", "slug": "step-iron", "short": "Ductile iron and GRP step ladders for safe manhole shaft descents.", "img": "product-step-iron.jpg"},
        {"name": "Stud Products", "slug": "stud-products", "short": "Non-slip tactile pavement studs and anti-slip access dots.", "img": "product-tactile-stud.jpg"},
    ]
    
    cat_objs = {}
    for idx, c_data in enumerate(categories_data):
        cat = ProductCategory.objects.create(
            name=c_data["name"],
            slug=c_data["slug"],
            short_description=c_data["short"],
            description=f"Detailed range of premium Arabian Gratings {c_data['name']} designed for industrial engineering works across UAE and GCC region.",
            image=media_objs.get(c_data["img"], default_media),
            sort_order=idx,
            is_active=True
        )
        cat_objs[c_data["slug"]] = cat
        print(f"Created category: {cat.name}")

    # 3. Create rich products matching technical parameters
    products_data = [
        # FRP/GRP Products
        {
            "category": "frp-grp-products",
            "name": "Moulded GRP Walkway Grating",
            "slug": "moulded-grp-walkway-grating",
            "code": "GRP-M-38",
            "short": "Chemical-safe fiberglass floor grids with slip-resistant grit finishes. Engineered for refinery utility yards.",
            "desc": "Arabian Gratings Moulded GRP (Glass Reinforced Plastic) gratings are engineered with isophthalic polyester or chemical-grade vinyl ester resin matrices. Ideal for highly corrosive environments such as desalination plants, chemical facilities, and offshore oil platforms.",
            "material": "Fiberglass Reinforced Plastic (GRP)",
            "finish": "Silicon Carbide Grit Surface",
            "standard": "ASTM E84, BS 476 class 1",
            "applications": "Desalination plants, chemical processing yards, marine access walks, refinery drainage channels",
            "features": "100% Corrosion immune\nNon-conductive electrical safety\nFire retardant resin chemistry\nHigh strength-to-weight ratio",
            "specs": [
                {"name": "Mesh Pitch", "value": "38 × 38 mm"},
                {"name": "Panel Height", "value": "38 mm"},
                {"name": "Bar Thickness", "value": "7 mm (top) / 5 mm (bottom)"},
                {"name": "Open Area", "value": "68% open flow"},
                {"name": "Resin Type", "value": "Isophthalic Polyester (Optional: Vinyl Ester)"}
            ],
            "faqs": [
                {"question": "What is the primary benefit of Moulded GRP over steel grating?", "answer": "GRP grating offers complete immunity to chemical corrosion and atmospheric salt spray, requires zero maintenance or painting, and is lightweight for easy manual handling during installation."},
                {"question": "Is GRP grating fire-retardant?", "answer": "Yes, our GRP gratings incorporate flame retardant additives yielding ASTM E84 class 1 fire safety classification with low flame spread indexes."}
            ],
            "img": "product-frp-grating.jpg",
            "is_featured": True
        },
        # Steel Gratings
        {
            "category": "steel-gratings",
            "name": "Electroforged Welded Steel Grating",
            "slug": "electroforged-welded-steel-grating",
            "code": "GI-SG-30100",
            "short": "Industrial heavy-duty metal floors galvanized to ISO 1461. Fabricated with high-strength load bearing bars.",
            "desc": "Arabian Gratings Electroforged Steel Grating is fabricated using high-strength carbon steel structural bars. Cross rods are electrically fused into the load-bearing bars under heavy hydraulic pressure to create a single-piece, rigid grid layout suitable for high wheel load spans.",
            "material": "ASTM A36 / S235JR Carbon Steel",
            "finish": "Hot-Dip Galvanized to BS EN ISO 1461",
            "standard": "BS 4592 Part 1, ANSI/NAAMM MBG531",
            "applications": "Industrial platforms, power plant walkways, cargo loading docks, heavy-duty drainage trenches",
            "features": "High load span deflection stiffness\nUniform hot-dip zinc protection layer\nSlip-resistant serrated load bar option\nCNC precision edge-banding compliance",
            "specs": [
                {"name": "Bearing Bar Size", "value": "30 × 3 mm (up to 40 × 5 mm)"},
                {"name": "Bearing Bar Pitch", "value": "30 mm center-to-center"},
                {"name": "Cross Rod Pitch", "value": "100 mm center-to-center"},
                {"name": "Galvanizing Depth", "value": "Minimum 85 microns (610 g/m²)"},
                {"name": "Load Capability", "value": "UDL up to 45.8 kN/m² at 1.2m span"}
            ],
            "faqs": [
                {"question": "What standard governs the hot-dip galvanizing?", "answer": "All carbon steel gratings are hot-dip galvanized in compliance with BS EN ISO 1461, ensuring a thick, uniform zinc layer of at least 85 microns for marine corrosion safety."},
                {"question": "Are custom circular cutouts available?", "answer": "Yes, we custom-cut and weld banded edges for circular penetrations, pipe notches, and custom angle cuts based on client-provided shop layouts."}
            ],
            "img": "product-steel-grating.jpg",
            "is_featured": True
        },
        # Stainless Steel Products
        {
            "category": "stainless-steel-products",
            "name": "Stainless Steel SS316 Floor Grating",
            "slug": "stainless-steel-ss316-floor-grating",
            "code": "SS-SG-255",
            "short": "Premium hygiene-safe SS316 grating panels. Engineered for extreme food processing and seawater splash decks.",
            "desc": "Premium stainless steel gratings engineered to satisfy demanding sanitary and extreme chemical corrosion regulations. Commonly specified in wastewater treatment plants, chemical process vessels, pharmaceutical labs, and coastal splash zones.",
            "material": "Stainless Steel Grade 316 (Optional: 304)",
            "finish": "Pickled and Passivated (Optional: Electro-polished)",
            "standard": "ASTM A380, BS 4592",
            "applications": "Food preparation facilities, chemical storage areas, seawater splash structures, sewerage treatment tanks",
            "features": "Ultimate organic chemical resistance\nHygiene-compliant cleanable surface\nHigh temperature tolerance\nExceptional aesthetic durability",
            "specs": [
                {"name": "Bearing Bar Size", "value": "25 × 5 mm"},
                {"name": "Bearing Bar Pitch", "value": "30 mm"},
                {"name": "Cross Rod Pitch", "value": "50 mm"},
                {"name": "Passivation Depth", "value": "Full acid pickling immersion"}
            ],
            "faqs": [
                {"question": "Why select Grade 316 over Grade 304?", "answer": "Grade 316 contains molybdenum which significantly increases resistance to chloride pitting corrosion, making it suitable for marine/coastal exposures and acidic cleanups."}
            ],
            "img": "product-ss-grating.jpg",
            "is_featured": True
        },
        # Aluminium
        {
            "category": "aluminium",
            "name": "Aluminium Access Grating Walkway",
            "slug": "aluminium-access-grating-walkway",
            "code": "AL-SG-253",
            "short": "Lightweight, non-sparking walkways and access grates. Ideal for high architectural finishes.",
            "desc": "Lightweight aluminium grating systems engineered for walkways, screen panel systems, and architectural facades where deadweight parameters are restricted. Non-sparking properties make it suitable for volatile environments.",
            "material": "Aluminium Alloy 6063-T6 / 6061-T6",
            "finish": "Mill Finish / Clear Anodized",
            "standard": "ASTM B221, BS 4592",
            "applications": "Sewage treatment domes, architecture facade screens, volatile gas storage access walks, suspended walkways",
            "features": "Lightweight (1/3rd of steel weight)\nNaturally non-sparking for safety\nAnodized corrosion prevention\nRecyclable green building spec",
            "specs": [
                {"name": "Bearing Bar Size", "value": "25 × 3 mm"},
                {"name": "Bearing Bar Pitch", "value": "30 mm"},
                {"name": "Cross Rod Pitch", "value": "100 mm"},
                {"name": "Anodizing Class", "value": "AA 20 (minimum 20 microns)"}
            ],
            "faqs": [
                {"question": "Is aluminium grating safe in explosive zones?", "answer": "Yes, the non-sparking characteristics of aluminium alloy make it highly recommended for explosive gas storage access walkways."}
            ],
            "img": "product-aluminium-grating.jpg",
            "is_featured": True
        },
        # Manhole
        {
            "category": "manhole",
            "name": "Ductile Iron Double Sealed Manhole Cover",
            "slug": "ductile-iron-double-sealed-manhole-cover",
            "code": "DI-MC-D400",
            "short": "Heavy-duty D400 traffic load rated ductile iron covers with double seal frames to prevent odor escaping.",
            "desc": "Premium ductile iron manhole covers featuring double-seal designs and secure locking blocks. Designed to withstand heavy vehicular wheel traffic and comply with regional municipal infrastructure standards.",
            "material": "Ductile Iron Grade GJS 500-7",
            "finish": "Black Bitumen Coated",
            "standard": "BS EN 124-2 Class D400",
            "applications": "Main roads, highway shoulders, commercial parking lots, public infrastructure channels",
            "features": "D400 rating (40 ton proof load)\nDouble sealed frame prevents odors\nSecure locking system prevents tampering\nSlip-resistant surface pattern",
            "specs": [
                {"name": "Clear Opening", "value": "600 × 600 mm (other sizes available)"},
                {"name": "Over Frame Size", "value": "750 × 750 mm"},
                {"name": "Frame Depth", "value": "100 mm"},
                {"name": "Seal Design", "value": "Double Sealed with Grease Chamber"}
            ],
            "faqs": [
                {"question": "What does Class D400 mean?", "answer": "Class D400 covers are certified to withstand test loads of 400 kN (approximately 40 tonnes), making them safe for carriageways of roads and municipal streets."}
            ],
            "img": "product-manhole-cover.jpg",
            "is_featured": True
        },
        # SS/GI Grating Clamps
        {
            "category": "ss-gi-grating-clamps",
            "name": "M-Clip Grating Fastening Clamp",
            "slug": "m-clip-grating-fastening-clamp",
            "code": "CLAMP-M-SS",
            "short": "Structural fastening clips in SS316. Ensures secure anchoring of panels onto structural beams.",
            "desc": "Arabian Gratings M-Clip clamping kits are engineered to anchor grating panels directly to structural steel support members. Ensures high shear resistance under severe vibrations.",
            "material": "Stainless Steel Grade 316 (Optional: Galvanized Steel)",
            "finish": "Acid Pickled Mill Finish",
            "standard": "Manufacturer Standard (fits all 38mm mesh configurations)",
            "applications": "Securing GRP/FRP molded panels, locking steel grating panels to I-beams",
            "features": "No drilling required on support beams\nHigh vibration loosening immunity\nDouble bolt saddle plate design",
            "specs": [
                {"name": "Material Thickness", "value": "2.0 mm heavy-duty gauge"},
                {"name": "Saddle Width", "value": "38 mm standard mesh span"},
                {"name": "Matching Bolt", "value": "M8 × 70 mm hex bolt with lock nut"}
            ],
            "faqs": [
                {"question": "How many clips are recommended per panel?", "answer": "For safety compliance, we recommend installing at least 4 M-Clips per standard 1m x 2m grating panel, placed at the corners."}
            ],
            "img": "product-grating-clamp.jpg",
            "is_featured": False
        },
        # Step Iron
        {
            "category": "step-iron",
            "name": "Ductile Iron Plastic Encapsulated Step Iron",
            "slug": "ductile-iron-plastic-encapsulated-step-iron",
            "code": "STEP-DI-GRP",
            "short": "High-durability plastic encapsulated ductile iron steps for utility chambers and sewer manholes.",
            "desc": "High safety step irons designed for waste utility chambers, inspection pits, and sewer shafts. Features a high-tensile ductile iron core encapsulated in chemical-proof virgin polypropylene plastic.",
            "material": "Ductile Iron GJS 500-7 Core / Virgin Polypropylene Cover",
            "finish": "Bright Yellow High-Visibility Plastic Wrap",
            "standard": "BS EN 13101",
            "applications": "Manhole shafts, water utility chambers, storm water pump stations",
            "features": "Corrosive chemical acid immunity\nHigh visibility yellow coating\nSlip-resistant foot stops",
            "specs": [
                {"name": "Step Width", "value": "240 mm inside clearance"},
                {"name": "Projection", "value": "150 mm wall projection depth"},
                {"name": "Pull-out Resistance", "value": "Certified up to 5.0 kN"}
            ],
            "faqs": [
                {"question": "Why is the iron core encapsulated in plastic?", "answer": "The polypropylene plastic prevents damp sewage gases from corroding the ductile iron structural core, ensuring structural climbing safety for decades."}
            ],
            "img": "product-step-iron.jpg",
            "is_featured": False
        },
        # Stud Products
        {
            "category": "stud-products",
            "name": "Stainless Steel Tactile Stud",
            "slug": "stainless-steel-tactile-stud",
            "code": "STUD-TS-35",
            "short": "Anti-slip tactile pavement warning studs in SS316. Engineered for pedestrian accessibility safety.",
            "desc": "High-end stainless steel tactile warning studs designed to assist visually impaired pedestrians at crosswalks, stairs, and platform edges. Meets international accessibility guidelines.",
            "material": "Stainless Steel Grade 316",
            "finish": "Machine Turned Serrated Surface / Concentric Rings",
            "standard": "ISO 23599, BS 8300",
            "applications": "Metro stations, airport pedestrian zones, crosswalk borders, outdoor public squares",
            "features": "High-friction concentric ring pattern\nDrill-and-grout stem installation\nCorrosion resistant grade 316 steel",
            "specs": [
                {"name": "Stud Diameter", "value": "35 mm top surface"},
                {"name": "Stud Height", "value": "5 mm raised profile"},
                {"name": "Stem Size", "value": "8 mm diameter × 20 mm length"}
            ],
            "faqs": [
                {"question": "How are tactile studs installed on natural stone?", "answer": "A core drill jig is used to create 8mm anchor holes, the holes are cleaned, and the tactile studs are grouted securely using high-bond epoxy adhesive."}
            ],
            "img": "product-tactile-stud.jpg",
            "is_featured": False
        }
    ]

    prod_objs = {}
    for p_data in products_data:
        cat = cat_objs[p_data["category"]]
        prod = Product.objects.create(
            category=cat,
            name=p_data["name"],
            slug=p_data["slug"],
            product_code=p_data["code"],
            short_description=p_data["short"],
            description=p_data["desc"],
            material=p_data["material"],
            finish=p_data["finish"],
            standard=p_data["standard"],
            applications=p_data["applications"],
            features=p_data["features"],
            faq=p_data["faqs"],
            is_featured=p_data["is_featured"],
            is_active=True
        )
        prod_objs[p_data["slug"]] = prod
        print(f"Created product: {prod.name}")

        # Add specifications table rows
        for idx, spec in enumerate(p_data["specs"]):
            ProductSpecification.objects.create(
                product=prod,
                name=spec["name"],
                value=spec["value"],
                sort_order=idx
            )
        
        # Add primary image
        img_name = p_data["img"]
        media = media_objs.get(img_name, default_media)
        if media:
            ProductImage.objects.create(
                product=prod,
                media=media,
                alt_text=f"Premium {prod.name} layout rendering",
                caption=f"Arabian Gratings {prod.name} product details",
                is_primary=True,
                sort_order=0
            )
            # Add a secondary image for gallery
            secondary_img_name = "facility-overview.jpg" if img_name != "facility-overview.jpg" else "product-steel-grating.jpg"
            sec_media = media_objs.get(secondary_img_name, default_media)
            if sec_media:
                ProductImage.objects.create(
                    product=prod,
                    media=sec_media,
                    alt_text=f"Secondary {prod.name} application view",
                    caption=f"Arabian Gratings {prod.name} application detail",
                    is_primary=False,
                    sort_order=1
                )

    # 4. Link related products (mutual relationships)
    all_prods = list(prod_objs.values())
    for prod in all_prods:
        rel_prods = [p for p in all_prods if p.id != prod.id][:3]
        prod.related_products.set(rel_prods)
        prod.save()
        print(f"Linked related products for: {prod.name}")

    # 5. Seed Industries
    print("Seeding Industries...")
    Industry.objects.all().delete()
    
    industries_data = [
        {
            "name": "Oil & Gas",
            "slug": "oil-gas",
            "short": "Exploration platforms, processing yards, and seawater splash zones requiring premium corrosion resistance.",
            "desc": "Arabian Gratings supplies high-performance safety flooring and access systems specifically engineered for the demanding conditions of the onshore and offshore Oil & Gas sector. From offshore drilling rigs and FPSO vessels to onshore refineries, gas processing plants, and sulfur storage facilities, our industrial grating products deliver unparalleled durability and compliance with strict API, ISO, and ASTM regulations.",
            "img": "industry-oilgas.jpg",
            "prods": ["moulded-grp-walkway-grating", "electroforged-welded-steel-grating", "m-clip-grating-fastening-clamp"]
        },
        {
            "name": "Marine & Offshore",
            "slug": "marine-offshore",
            "short": "Vessel decks, cargo bays, coastal jetties, and mooring structures subject to harsh salt spray.",
            "desc": "Access walkways, gangways, vessel decks, and dock structures are continuously exposed to saltwater, tidal waves, and severe atmospheric moisture. Arabian Gratings provides hot-dip galvanized steel grids and advanced GRP molded gratings that resist marine corrosion and salt spray fatigue, ensuring structural integrity and slip-resistant footing for crews.",
            "img": "project-marine.jpg",
            "prods": ["moulded-grp-walkway-grating", "stainless-steel-ss316-floor-grating", "m-clip-grating-fastening-clamp"]
        },
        {
            "name": "Desalination Plants",
            "slug": "water-treatment",
            "short": "Chemical-safe GRP grids and stainless floor plates for humid, chlorine-heavy utility yards.",
            "desc": "Desalination plants and wastewater treatment facilities handle highly corrosive chemicals, chlorine-heavy environments, and high humidity levels. Our GRP/FRP gratings and stainless steel gratings are designed with vinyl ester resin matrices and pickling finishes to offer complete resistance to chemical splash and acidic attacks, securing safe walking platforms in water utilities.",
            "img": "project-refinery.jpg",
            "prods": ["moulded-grp-walkway-grating", "stainless-steel-ss316-floor-grating", "aluminium-access-grating-walkway"]
        },
        {
            "name": "Infrastructure",
            "slug": "infrastructure",
            "short": "Trench covers, utility ducts, access walkways, and ventilation screens for municipal projects.",
            "desc": "Arabian Gratings supplies heavy-duty trench covers, drainage grates, manhole covers, and utility duct frames for roads, railways, airports, and municipal construction projects. Engineered for heavy wheel loads (such as D400 and E600 classes), our access systems ensure safe traffic flow and long service life across urban municipal networks.",
            "img": "cta-factory.jpg",
            "prods": ["electroforged-welded-steel-grating", "ductile-iron-double-sealed-manhole-cover", "ductile-iron-plastic-encapsulated-step-iron", "stainless-steel-tactile-stud"]
        }
    ]

    for ind_data in industries_data:
        ind = Industry.objects.create(
            name=ind_data["name"],
            slug=ind_data["slug"],
            short_description=ind_data["short"],
            description=ind_data["desc"],
            image=media_objs.get(ind_data["img"], default_media),
            is_active=True,
            no_index=False
        )
        # Link related products
        linked_prods = [prod_objs[p_slug] for p_slug in ind_data["prods"] if p_slug in prod_objs]
        ind.related_products.set(linked_prods)
        ind.save()
        print(f"Created industry: {ind.name} and linked {len(linked_prods)} products.")

    print("Product & Industry database seeding completed successfully!")

if __name__ == "__main__":
    seed()
