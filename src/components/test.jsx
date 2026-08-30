<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-01GGHY80ME"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-01GGHY80ME');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecopath | Sustainable Cement-Free Road Infrastructure</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <meta name="theme-color" content="#17411A">
    <meta name="msapplication-navbutton-color" content="#17411A">
    <meta name="apple-mobile-web-app-status-bar-style" content="#17411A">

    <meta name="description"
        content="Ecopath is decarbonizing the construction industry with innovative, cement-free road infrastructure solutions. We build sustainable, durable, and green roads for a better future.">
    <meta name="keywords"
        content="Ecopath, Sustainable Roads, Cement-Free Concrete, Green Construction, Road Infrastructure, Decarbonization, Eco-friendly Pavers">
    <meta name="author" content="Ecopath">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ecopath.earth/">
    <meta property="og:title" content="Ecopath | Sustainable Cement-Free Infrastructure">
    <meta property="og:description"
        content="Pioneering the next generation of road construction. Faster, greener, and cement-free.">
    <meta property="og:image" content="https://lh3.googleusercontent.com/d/17LPQaqhsP38n7dij_cr9WGnMPulaE_kj">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://ecopath.earth/">
    <meta property="twitter:title" content="Ecopath | Sustainable Cement-Free Infrastructure">
    <meta property="twitter:description"
        content="Pioneering the next generation of road construction. Faster, greener, and cement-free.">
    <meta property="twitter:image" content="/static/images/Ecopath_Share_Card.jpg">
    <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/static/images/favicon-48x48.png">

    <link rel="apple-touch-icon" sizes="180x180" href="/static/images/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" href="/static/images/apple-touch-icon.png">
    <link rel="manifest" href="/static/images/manifest.webmanifest">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="/static/css/fonts.css">

    <!-- <style>
        @font-face {
            font-family: 'Product Sans';
            src: url("/static/fonts/ProductSans-Black.ttf") format('truetype');
            font-weight: 900;
            font-style: normal;
        }

        @font-face {
            font-family: 'Product Sans Regular';
            src: url("/static/fonts/ProductSans-Regular.ttf") format('truetype');
            font-weight: 400;
            font-style: normal;
        }

        @font-face {
            font-family: 'Product Sans Medium';
            src: url("/static/fonts/ProductSans-Medium.ttf") format('truetype');
            font-weight: 500;
            font-style: normal;
        }
    </style> -->
    <link rel="stylesheet" href="/static/css/navbar_footer.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="icon" type="image/x-icon" href="/static/images/EcopathLogo.png">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'custom-green': '#17411A',
                        'custom-yellow': '#F0ED2F',
                        'card-bg-green': '#9ae69e',      // Used in Services & Sustainability
                        'card-bg-dark-green': '#5bd464'  // Used in Sustainability
                    },
                    fontFamily: {
                        'montserrat': ['Montserrat', 'sans-serif'],
                        'poppins': ['Poppins', 'sans-serif'],
                        'playfair-display': ['Playfair Display', 'serif'],

                        // MAPPING YOUR CUSTOM CSS FONTS ACCURATELY:
                        // Use class="font-product-sans" for the Heavy/Black header font
                        'product-sans': ['Product Sans', 'sans-serif'],

                        // Use class="font-product-sans-regular" for body text
                        'product-sans-regular': ['Product Sans Regular', 'sans-serif'],

                        // Use class="font-product-sans-medium" for sub-headings
                        'product-sans-medium': ['Product Sans Medium', 'sans-serif'],
                    },
                    maxWidth: {
                        '8xl': '1440px', // Fixes the "Zoomed In" navbar issue
                    },
                    // These extend your ability to use specific weights if the font family supports it
                    fontWeight: {
                        light: '300',
                        normal: '400',
                        medium: '500',
                        semibold: '600',
                        bold: '700',
                        extrabold: '800',
                        black: '900',
                    },
                    fontSize: {
                        'sm': '14px',
                        'lg': '18px',
                        '5xl': '48px',
                    },
                    screens: {
                        '3xl': '1600px',
                    }
                }
            }
        }
    </script>

    
<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<style>
    /* Custom styles */
    .ecopath-card {
        will-change: flex;
    }

    .card-content {
        will-change: transform;
    }

    .heading,
    .description {
        will-change: opacity, max-width, max-height;
    }

    /* Hero Section Styles */
    .hero-slide {
        opacity: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .text-shadow {
        text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-dot {
        background-color: rgba(255, 255, 255, 0.3);
        transition: background-color 0.3s ease;
    }

    .hero-dot.active {
        background-color: rgba(255, 255, 255, 1);
    }

    .hero-nav-item-slot {
        display: inline-block;
    }

    .hero-nav-group {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        /* 24px */
        opacity: 0;
    }

    .no-scrollbar::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Edge, Opera */
    }

    .no-scrollbar {
        -ms-overflow-style: none;
        /* IE and Edge */
        scrollbar-width: none;
        /* Firefox */
    }

    #slide-1 {
        background-image: url('/static/%20images/Home%20hero%20header.webp');
    }

    @media screen and (max-width: 1024px) {
        #slide-1 {
            background-image: url('/static/%20images/Mobile%20version%20hero%20header.webp');
        }
    }

    @media screen and (max-width:400px) {
        #carousel_section {
            height: 110vh !important;
        }
    }
</style>
<!-- <script>
    // Custom Tailwind configuration (merging with base if needed, but base already has it. 
    // If this page needs specific config, it might conflict or need to be after base config. 
    // Since base has the same config, we can skip re-declaring it or keep it if it has page-specifics.
    // The file had: custom-green, custom-yellow. Base has custom-green.
    // I will add custom-yellow to the config here or rely on base if I update base.
    // Let's re-declare to be safe for now, or better, just add the missing one.
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    'custom-green': '#17411A',
                    'custom-yellow': '#F0ED2F',
                },
                fontFamily: {
                    'montserrat': ['Montserrat', 'sans-serif'],
                    'product-sans': ['Product Sans', 'sans-serif'],
                    'playfair-display': ['Playfair Display', 'serif'],
                    'product-sans-medium' : ['Product Sans Medium', 'sans-serif'],
                },
                fontSize: {
                    'sm': '14px', // 14px
                    'lg': '18px', // 18px
                    '5xl': '48px', // 48px
                }
            }
        }
    }
</script> -->

</head>

<body class="bg-white overflow-x-hidden font-montserrat">

    <header class="w-full relative z-[100]">
        <nav id="main-navbar"
            class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md w-full transition-transform duration-500 ease-in-out border-b border-gray-100/50 shadow-md">

            <div class="max-w-screen mx-auto px-6 lg:px-6 flex justify-between items-center py-2">

                <a href="/"
                    class="flex items-center h-16 flex-shrink-0 transition-all duration-300">
                    <img src="/static/images/EcoPathLogo.png" alt="Ecopath Logo"
                        class="h-full w-auto object-contain">
                </a>

                <ul
                    class="hidden lg:flex items-center space-x-12 text-base text-custom-green font-montserrat font-semibold desktop-nav">
                    <li class="active">
                        <a href="/" class="nav-link">Home</a>
                    </li>

                    <li class="relative group">
                        <a href="#" class="nav-link flex items-center">What we do
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </a>
                        <div
                            class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 border border-gray-100 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
                            <a href="/technology-products/"
                                class="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-custom-green transition-colors">Technology
                                & Products</a>
                            <a href="/services/"
                                class="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-custom-green transition-colors">Services</a>
                            <a href="/projects/"
                                class="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 hover:text-custom-green transition-colors">Our
                                Projects</a>
                        </div>
                    </li>

                    <li class="">
                        <a href="/sustainability/" class="nav-link text-base">Sustainability</a>
                    </li>
                    <li class="">
                        <a href="/about/" class="nav-link text-base">About Us</a>
                    </li>
                    <li class="">
                        <a href="/blog/" class="nav-link text-base">Blogs</a>
                    </li>
                    <li class="">
                        <a href="/contact/"
                            class="nav-link bg-custom-green text-white px-6 py-2.5 rounded-full hover:bg-green-800 transition-colors shadow-md !text-white after:!hidden">Contact
                            Us</a>
                    </li>
                </ul>

                <div class="lg:hidden">
                    <button id="hamburger-btn"
                        class="text-custom-green focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <div id="mobile-menu"
        class="fixed inset-0 bg-custom-green z-[110] transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto">

        <div class="flex justify-between items-center p-6 border-b border-white/10">
            <img src="/static/images/EcoPathLogo.png" alt="Ecopath Logo" class="h-16 w-auto object-contain">
            <button id="close-btn"
                class="text-white focus:outline-none p-2 hover:bg-white/10 rounded-full transition-colors transform hover:rotate-90 duration-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>

        <ul class="flex flex-col px-6 pb-12">
            <li class="border-b border-white/10">
                <a href="/"
                    class="block py-5 text-2xl sm:text-3xl font-product-sans font-bold text-white hover:text-custom-yellow transition-colors">
                    HOME
                </a>
            </li>

            <li class="border-b border-white/10">
                <div class="w-full">
                    <button id="mobile-dropdown-btn"
                        class="flex items-center justify-between w-full py-5 text-2xl sm:text-3xl font-product-sans font-bold text-white hover:text-custom-yellow transition-colors focus:outline-none">
                        <span>WHAT WE DO</span>
                        <svg id="mobile-dropdown-icon" class="w-6 h-6 transform transition-transform duration-300"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>
                    </button>
                    <div id="mobile-dropdown-content"
                        class="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out bg-[#123314] -mx-6 px-6">
                        <div class="py-4 space-y-4">
                            <a href="/technology-products/"
                                class="block text-lg font-montserrat font-medium text-gray-300 hover:text-white pl-4 border-l-2 border-transparent hover:border-custom-yellow transition-all">
                                TECHNOLOGY AND PRODUCTS
                            </a>
                            <a href="/services/"
                                class="block text-lg font-montserrat font-medium text-gray-300 hover:text-white pl-4 border-l-2 border-transparent hover:border-custom-yellow transition-all">
                                SERVICES
                            </a>
                            <a href="/projects/"
                                class="block text-lg font-montserrat font-medium text-gray-300 hover:text-white pl-4 border-l-2 border-transparent hover:border-custom-yellow transition-all">
                                OUR PROJECTS
                            </a>
                        </div>
                    </div>
                </div>
            </li>

            <li class="border-b border-white/10">
                <a href="/sustainability/"
                    class="block py-5 text-2xl sm:text-3xl font-product-sans font-bold text-white hover:text-custom-yellow transition-colors">
                    SUSTAINABILITY
                </a>
            </li>

            <li class="border-b border-white/10">
                <a href="/about/"
                    class="block py-5 text-2xl sm:text-3xl font-product-sans font-bold text-white hover:text-custom-yellow transition-colors">
                    ABOUT US
                </a>
            </li>

            <li class="border-b border-white/10">
                <a href="/blog/"
                    class="block py-5 text-2xl sm:text-3xl font-product-sans font-bold text-white hover:text-custom-yellow transition-colors">
                    BLOGS
                </a>
            </li>

            <li class="pt-8">
                <a href="/contact/"
                    class="block w-full text-center bg-white text-custom-green text-xl font-bold font-product-sans py-4 rounded-full shadow-lg hover:bg-custom-yellow hover:text-custom-green transition-all transform hover:scale-[1.02]">
                    CONTACT US
                </a>
            </li>
        </ul>
    </div>

    <div class="w-full min-h-screen">
        
<!-- Hero Section -->
<div id="carousel-container" class="relative w-full h-screen overflow-hidden text-white">
    <!-- Slides -->
    <div id="slide-2" class="hero-slide absolute top-0 left-0 w-full h-full"
        style="background-image: url('/static/images/Hero%20image%202.webp');">
        <div class="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
        <div class="relative w-full h-full flex items-center justify-start z-20 px-4 sm:px-24 lg:px-48">
            <div class="text-left max-w-5xl p-8 mx-auto">
                <h1 class="text-4xl md:text-6xl font-black font-product-sans text-white/90 text-shadow leading-tight">
                    Let's make green construction the norm, not the exception.</h1>
            </div>
        </div>
    </div>
    <div id="slide-3" class="hero-slide absolute top-0 left-0 w-full h-full"
        style="background-image: url('/static/images/Hero%20image%203.webp');">
        <div class="absolute top-0 left-0 w-full h-full bg-black/40 z-10 text-left"></div>
        <div class="relative w-full h-full flex items-center justify-start z-20 px-4 sm:px-24 lg:px-48">
            <div class="text-left md:max-w-5xl p-8 mx-auto">
                <h1 class="text-4xl md:text-6xl font-black font-product-sans text-white/90 text-shadow leading-tight">We
                    aim to decarbonize the construction industry and make green construction mainstream and affordable.
                </h1>
            </div>
        </div>
    </div>

    <!-- Navigation Container -->
    <div id="nav-container"
        class="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 overflow-hidden bg-white/30 backdrop-blur-md rounded-xl shadow-lg px-2 md:px-10 py-2 min-w-[22rem] md:min-w-[40rem] 2xl:min-w-[42rem]">
        <div class="relative w-full h-[40px] md:h-[48px]">
            <div id="nav-group-1" class="hero-nav-group w-full">
                <span class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Road
                    Design</span>
                <span
                    class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Sustainability</span>
                <span
                    class="hero-nav-item-slot hidden md:block flex-1 text-center font-montserrat font-bold text-black">Carbon
                    Dioxide</span>
            </div>
            <div id="nav-group-2" class="hero-nav-group w-full">
                <span
                    class="hero-nav-item-slot flex-1 text-center hidden md:block font-montserrat font-bold text-black">Water
                    Saving</span>
                <span class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Eco
                    Concrete</span>
                <span class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Cement
                    Free</span>
            </div>
            <div id="nav-group-3" class="hero-nav-group w-full">
                <span class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Water
                    Saving</span>
                <span class="hero-nav-item-slot flex-1 text-center font-montserrat font-bold text-black">Quality</span>
                <span
                    class="hero-nav-item-slot flex-1 text-center hidden md:block font-montserrat font-bold text-black">Sustainability</span>
            </div>
        </div>
    </div>

    <!-- Dot Indicators -->
    <div id="carousel-dots" class="absolute bottom-4 left-0 w-full z-30 flex justify-center items-center gap-3 p-4">
        <button class="hero-dot w-3 h-3 rounded-full"></button>
        <button class="hero-dot w-3 h-3 rounded-full"></button>
    </div>
</div>

<!-- Impacts Section -->
<section class="py-10 mt-4 px-6 lg:px-12">
    <div class="container mx-auto max-w-full">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-product-sans font-black py-8 text-custom-green">
            Measurable Progress. Real Impact.
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <!-- Service Card 1 -->
            <div
                class="bg-card-bg-green rounded-xl p-8 py-24 lg:py-36 shadow-md flex flex-col items-center justify-center text-center">
                <h3 class="text-3xl md:text-4xl font-product-sans font-black py-6">75 - 80%</h3>
                <p class="font-montserrat text-lg md:text-xl">
                    less CO2 emissions than traditional concrete.
                </p>
            </div>

            <!-- Service Card 2 -->
            <div
                class="bg-card-bg-green rounded-xl p-8 py-24 lg:py-36 shadow-md flex flex-col items-center justify-center text-center">
                <h3 class="text-3xl md:text-4xl font-product-sans font-black mb-4">30%</h3>
                <p class="font-montserrat text-lg md:text-xl ">
                    water saved during production.
                </p>
            </div>

            <!-- Service Card 3 -->
            <div
                class="bg-card-bg-green rounded-xl p-2 py-24 lg:py-36 shadow-md flex flex-col items-center justify-center text-center">
                <h3 class="text-3xl md:text-4xl font-product-sans font-black mb-4">10,000+ tonnes</h3>
                <p class="font-montserrat text-lg md:text-xl ">
                    of industrial waste reused.
                </p>
            </div>

            <!-- Service Card 4 -->
            <div
                class="bg-card-bg-green rounded-xl p-8 py-24 lg:py-36 shadow-md flex flex-col items-center justify-center text-center">
                <h3 class="text-3xl md:text-4xl font-product-sans font-black mb-4">2x</h3>
                <p class="font-montserrat text-lg md:text-xl ">
                    road lifespan compared to cement-based ones.
                </p>
            </div>
        </div>
    </div>
</section>

<!--Why roads need to change-->
<section class="mx-auto px-6 lg:px-12 py-20 flex flex-col justify-center">
    <h2 class="text-4xl md:text-5xl font-product-sans font-black text-custom-green text-center mb-8">Why Roads Need to
        Change?</h2>
    <div class="flex flex-col lg:flex-row items-center gap-12">
        <!-- Image Collage -->
        <div class="w-full lg:w-1/2 h-64 flex justify-center lg:justify-end items-center">
            <div class="relative w-[25rem] lg:w-[27.5rem] xl:w-[30rem] 2xl:w-[32.5rem] h-48 lg:me-[5rem]">
                <!-- Image 1 -->
                <div
                    class="absolute top-0 left-0 w-32 lg:w-40 h-48 lg:h-60 overflow-hidden group rounded-tr-[3rem] rounded-bl-[3rem]">
                    <div class="relative w-full h-full">
                        <img src="/static/images/roads_change(1).webp" alt="High Carbon Emissions"
                            class="w-full h-full object-cover">
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 p-6 py-8 flex items-end">
                            <span
                                class="font-montserrat text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">High  
                                Carbon Emissions</span>
                        </div>
                    </div>
                </div>
                <!-- Image 2 -->
                <div
                    class="absolute top-8 left-[5.5rem] lg:left-[6.9rem] xl:left-[7.5rem] 2xl:left-[7.5rem]  w-32 lg:w-40 h-48 lg:h-60 overflow-hidden z-10 group rounded-br-[3rem] rounded-tl-[3rem]">
                    <div class="relative w-full h-full">
                        <img src="/static/images/roads_change(2).webp" alt="Road Maintenance"
                            class="w-full h-full object-cover">
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 p-6 py-8 flex items-start">
                            <span
                                class="font-montserrat text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Road<br>
                                Maintenance</span>
                        </div>
                    </div>
                </div>
                <!-- Image 3 -->
                <div
                    class="absolute top-0 left-[11rem] lg:left-[13.3rem] xl:left-[14.5rem] 2xl:left-[15rem] w-32 lg:w-40 h-48 lg:h-60 overflow-hidden z-20 group rounded-tr-[3rem] rounded-bl-[3rem]">
                    <div class="relative w-full h-full">
                        <img src="/static/images/roads_change(3).webp" alt="Project Delays"
                            class="w-full h-full object-cover">
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 p-6 py-8 flex items-end">
                            <span
                                class="font-montserrat text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Project<br>
                                Delays</span>
                        </div>
                    </div>
                </div>
                <!-- Image 4 -->
                <div
                    class="absolute top-8 left-[16.5rem] lg:left-[19.5rem] xl:left-[21.7rem] 2xl:left-[22.5rem] h-48 lg:h-60 w-32 lg:w-40 overflow-hidden z-20 group rounded-br-[3rem] rounded-tl-[3rem]">
                    <div class="relative w-full h-full">
                        <img src="/static/images/roads_change(4).webp" alt="Rising Costs"
                            class="w-full h-full object-cover">
                        <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 p-6 py-8 flex items-start">
                            <span
                                class="font-montserrat text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Rising
                                Costs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Text Content -->
        <div class="w-full lg:w-1/2 flex justify-start px-4 md:px-0">
            <p
                class="text-lg text-gray-700 font-montserrat leading-relaxed w-full lg:max-w-[30rem] xl:max-w-[32.5rem] 2xl:w-[37.5rem]">
                Traditional road construction comes with a heavy price — high carbon emissions, constant maintenance,
                rising costs, and endless delays. These challenges not only strain the environment but also slow down
                progress and drain valuable resources. At Ecopath, we set out to change this by rethinking how roads are
                built — faster, greener, and more sustainable for the future.
            </p>
        </div>
    </div>
</section>

<!-- We at EcoPath Section -->
<section class="py-16 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-product-sans font-black text-custom-green mb-12 leading-tight">
            We at Ecopath
        </h2>

        <div id="cards-container"
            class="flex flex-col md:flex-row w-full h-[100vh] md:h-[70vh] rounded-lg overflow-hidden shadow-2xl bg-white gap-y-3 md:gap-y-0 md:gap-x-3">
            <!-- Card 1 -->
            <div class="card flex-1 relative bg-cover bg-center cursor-pointer overflow-hidden group"
                style="background-image: url('/static/images/we_at_ecopath_1.webp');">
                <div class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/60"></div>

                <!-- Header Group: Number + Title -->
                <div class="header-group absolute flex items-center z-20">
                    <span class="number text-6xl md:text-7xl lg:text-8xl font-black text-white/90 leading-none">1</span>
                    <h2
                        class="heading text-xl font-product-sans md:text-2xl lg:text-3xl font-bold uppercase text-white ml-4 whitespace-nowrap overflow-hidden opacity-0 w-0">
                        Build Roads
                    </h2>
                </div>

                <!-- Description -->
                <p
                    class="description font-montserrat font-medium absolute text-lg md:text-xl text-white/90 w-full z-10 opacity-0 px-8">
                    We stabilize the soil you already have, no soil is imported, engineering road design for better
                    durability and build roads for life long longevity.
                </p>
            </div>

            <!-- Card 2 -->
            <div class="card flex-1 relative bg-cover bg-center cursor-pointer overflow-hidden group"
                style="background-image: url('/static/images/we_at_ecopath_2.webp');">
                <div class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/60"></div>

                <div class="header-group absolute flex items-center z-20">
                    <span class="number text-6xl md:text-7xl lg:text-8xl font-black text-white/90 leading-none">2</span>
                    <h2
                        class="heading font-product-sans text-xl md:text-2xl lg:text-3xl font-bold uppercase text-white ml-4 whitespace-nowrap overflow-hidden opacity-0 w-0">
                        Sustainable Solutions
                    </h2>
                </div>

                <p
                    class="description font-montserrat font-medium absolute text-lg md:text-xl text-white/90 w-full z-10 opacity-0 px-8">
                    Our innovative approach reduces carbon footprint and environmental impact while delivering
                    high-quality, long-lasting road infrastructure.
                </p>
            </div>

            <!-- Card 3 -->
            <div class="card flex-1 relative bg-cover bg-center cursor-pointer overflow-hidden group"
                style="background-image: url('/static/images/we_at_ecopath_3.webp');">
                <div class="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/60"></div>

                <div class="header-group absolute flex items-center z-20">
                    <span class="number text-6xl md:text-7xl lg:text-8xl font-black text-white/90 leading-none">3</span>
                    <h2
                        class="heading text-xl font-product-sans font-medium md:text-2xl lg:text-3xl font-bold uppercase text-white ml-4 whitespace-nowrap overflow-hidden opacity-0 w-0">
                        Future Ready
                    </h2>
                </div>
                <p
                    class="description font-montserrat font-medium absolute text-lg md:text-xl text-white/90 w-full z-10 opacity-0 px-8">
                    Pioneering the next generation of road construction with cutting-edge technology and sustainable
                    practices for a better tomorrow.
                </p>
            </div>
        </div>
    </div>
</section>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const cards = gsap.utils.toArray('.card');
        const container = document.getElementById('cards-container');
        let activeCard = null;
        let mm = gsap.matchMedia();

        // --- COMMON SETUP ---
        const setupCards = () => {
            cards.forEach(card => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');

                gsap.set(headerGroup, {
                    top: '50%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: -50
                });

                gsap.set(description, {
                    top: '60%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: -30,
                    opacity: 0
                });

                gsap.set(heading, { width: 0, opacity: 0 });
            });
        };

        // --- ANIMATION LOGIC ---

        mm.add("(min-width: 1200px) ", () => {
            // DESKTOP: Horizontal Flex
            setupCards();

            const animateInDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power3.inOut' } });

                tl.to(card, { flex: 5 }, 0);
                tl.to(headerGroup, { top: '30%', left: '2rem', xPercent: 0, yPercent: 0 }, 0);
                tl.to(heading, { width: 'auto', opacity: 1, marginLeft: '1rem' }, 0);
                tl.to(description, { top: '60%', opacity: 1 }, 0);
                return tl;
            };

            const animateOutDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' } });

                tl.to(card, { flex: 1 }, 0);
                tl.to(headerGroup, { top: '50%', left: '50%', xPercent: -50, yPercent: -30 }, 0);
                tl.to(heading, { width: 0, opacity: 0, marginLeft: 0 }, 0);
                tl.to(description, { top: '60%', opacity: 0 }, 0);
                return tl;
            };

            // Event Listeners for Desktop
            cards.forEach(card => {
                card.onmouseenter = () => {
                    if (activeCard === card) return;
                    if (activeCard) animateOutDesktop(activeCard);
                    activeCard = card;
                    animateInDesktop(card);
                };
            });

            container.onmouseleave = () => {
                if (activeCard) {
                    animateOutDesktop(activeCard);
                    activeCard = null;
                }
            };

            return () => {
                // Cleanup
                cards.forEach(c => c.onmouseenter = null);
                container.onmouseleave = null;
            };
        });

        mm.add("(min-width: 1200px) and (max-width: 1500px) ", () => {
            // DESKTOP: Horizontal Flex
            setupCards();

            const animateInDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power3.inOut' } });

                tl.to(card, { flex: 5 }, 0);
                tl.to(headerGroup, { top: '30%', left: '2rem', xPercent: 0, yPercent: 0 }, 0);
                tl.to(heading, { width: 'auto', opacity: 1, marginLeft: '1rem' }, 0);
                tl.to(description, { top: '70%', opacity: 1 }, 0);
                return tl;
            };

            const animateOutDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' } });

                tl.to(card, { flex: 1 }, 0);
                tl.to(headerGroup, { top: '50%', left: '50%', xPercent: -50, yPercent: -30 }, 0);
                tl.to(heading, { width: 0, opacity: 0, marginLeft: 0 }, 0);
                tl.to(description, { top: '65%', opacity: 0 }, 0);
                return tl;
            };

            // Event Listeners for Desktop
            cards.forEach(card => {
                card.onmouseenter = () => {
                    if (activeCard === card) return;
                    if (activeCard) animateOutDesktop(activeCard);
                    activeCard = card;
                    animateInDesktop(card);
                };
            });

            container.onmouseleave = () => {
                if (activeCard) {
                    animateOutDesktop(activeCard);
                    activeCard = null;
                }
            };

            return () => {
                // Cleanup
                cards.forEach(c => c.onmouseenter = null);
                container.onmouseleave = null;
            };
        });

        mm.add("(min-width: 768px) and (max-width: 1199px)", () => {
            // DESKTOP: Horizontal Flex
            setupCards();

            const animateInDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power3.inOut' } });

                tl.to(card, { flex: 5 }, 0);
                tl.to(headerGroup, { top: '25%', left: '2rem', xPercent: 0, yPercent: 0 }, 0);
                tl.to(heading, { width: 'auto', opacity: 1, marginLeft: '1rem' }, 0);
                tl.to(description, { top: '70%', opacity: 1 }, 0);
                return tl;
            };

            const animateOutDesktop = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' } });

                tl.to(card, { flex: 1 }, 0);
                tl.to(headerGroup, { top: '50%', left: '50%', xPercent: -50, yPercent: -30 }, 0);
                tl.to(heading, { width: 0, opacity: 0, marginLeft: 0 }, 0);
                tl.to(description, { top: '60%', opacity: 0 }, 0);
                return tl;
            };

            // Event Listeners for Desktop
            cards.forEach(card => {
                card.onmouseenter = () => {
                    if (activeCard === card) return;
                    if (activeCard) animateOutDesktop(activeCard);
                    activeCard = card;
                    animateInDesktop(card);
                };
            });

            container.onmouseleave = () => {
                if (activeCard) {
                    animateOutDesktop(activeCard);
                    activeCard = null;
                }
            };

            return () => {
                // Cleanup
                cards.forEach(c => c.onmouseenter = null);
                container.onmouseleave = null;
            };
        });

        mm.add("(max-width: 767px)", () => {
            // MOBILE: Vertical Flex
            setupCards();

            const animateInMobile = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power3.inOut' } });

                // Animate flex-grow for vertical expansion
                tl.to(card, { flex: 3 }, 0);

                // Move Number to Top Left (adjusted for smaller screens)
                tl.to(headerGroup, { top: '30%', left: '2rem', xPercent: 0, yPercent: 0 }, 0);

                tl.to(heading, { width: 'auto', opacity: 1, marginLeft: '0.5rem' }, 0);
                tl.to(description, { top: '60%', opacity: 1 }, 0);
                return tl;
            };

            const animateOutMobile = (card) => {
                const headerGroup = card.querySelector('.header-group');
                const description = card.querySelector('.description');
                const heading = card.querySelector('.heading');
                const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.inOut' } });

                tl.to(card, { flex: 1 }, 0);
                tl.to(headerGroup, { top: '50%', left: '50%', xPercent: -50, yPercent: -30 }, 0);
                tl.to(heading, { width: 0, opacity: 0, marginLeft: 0 }, 0);
                tl.to(description, { top: '60%', opacity: 0 }, 0);
                return tl;
            };

            // Event Listeners for Mobile (Click instead of Hover usually better, but keeping hover logic for consistency if requested, 
            // though click is standard for mobile accordions. Using click here for better UX)
            cards.forEach(card => {
                card.onclick = () => {
                    if (activeCard === card) {
                        // Toggle off if clicking active
                        animateOutMobile(activeCard);
                        activeCard = null;
                    } else {
                        if (activeCard) animateOutMobile(activeCard);
                        activeCard = card;
                        animateInMobile(card);
                    }
                };
            });

            return () => {
                cards.forEach(c => c.onclick = null);
            };
        });
    });
</script>

<!-- Drain Animation Section -->
<section class="py-16 px-6 lg:px-12 bg-[#E6E6DF]">
    <div class="max-w-full mx-auto">
        <div class="flex flex-col md:flex-row md:justify-between gap-8 md:gap-16">
            <!-- Content Column (Left on large screens) -->
            <div class="md:w-1/2 flex justify-start flex-col">
                <h2 class="text-3xl md:text-4xl font-product-sans font-black text-custom-green mb-12 leading-tight">
                    Entire Road Infra Development Under One Roof
                </h2>
                <p class="text-lg font-montserrat mb-12 max-w-3xl">
                    The biggest pain point for delays & losses is multiple vendors & lack of coordination.
                    Eco Path takes care of everything. All concrete products without using cement.
                </p>

                <!-- Navigation List -->
                <div class="flex justify-start">
                    <ul id="infra-nav" class="relative space-y-4 w-full max-w-xs">
                        <!-- Active Item Indicator Bar -->
                        <li id="active-bar"
                            class="absolute left-0 w-1 h-6 bg-custom-green transition-all duration-200 ease-in-out"
                            style="top: 0px;"></li>

                        <!-- List Items -->
                        <li class="nav-item text-xl font-product-sans font-black pl-6 cursor-pointer transition-colors duration-200 hover:text-custom-green"
                            data-index="1">
                            Drain
                        </li>
                        <li class="nav-item text-xl font-product-sans font-black  pl-6 cursor-pointer transition-colors duration-200 hover:text-custom-green"
                            data-index="2">
                            Footpath
                        </li>
                        <li class="nav-item text-xl font-product-sans font-black  pl-6 cursor-pointer transition-colors duration-200 hover:text-custom-green"
                            data-index="3">
                            Sewer Line
                        </li>
                        <li class="nav-item text-xl font-product-sans font-black  pl-6 cursor-pointer transition-colors duration-200 hover:text-custom-green"
                            data-index="4">
                            Electricity Lines
                        </li>
                        <li class="nav-item text-xl font-product-sans font-black  pl-6 cursor-pointer transition-colors duration-200 hover:text-custom-green"
                            data-index="5">
                            Street Lights
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Image Stack (Right on large screens) -->
            <div class="w-full md:w-1/2 2xl:h-[35rem] h-[25rem] flex items-center justify-center mt-8 md:mt-0">
                <!-- Added 'relative' here to ensure absolute children position correctly relative to this container -->
                <div class="image-stack-container w-full h-full relative mx-10 my-10">
                    <img src="/static/images/Drain.webp" alt="Drain"
                        class="image-card data-[index='0'] absolute w-[70%] md:w-3/5 h-auto rounded-2xl" data-index="1">
                    <img src="/static/images/Footpath.webp" alt="Footpath"
                        class="image-card data-[index='1'] absolute w-[70%] md:w-3/5 h-auto rounded-2xl" data-index="2">
                    <img src="/static/images/Sewer%20Line.webp" alt="Sewer Line"
                        class="image-card data-[index='2'] absolute w-[70%] md:w-3/5 h-auto rounded-2xl" data-index="3">
                    <img src="/static/images/Electricity%20Lines.webp" alt="Electricity Lines"
                        class="image-card data-[index='3'] absolute w-[70%] md:w-3/5 h-auto rounded-2xl" data-index="4">
                    <img src="/static/images/Street%20Lights.webp" alt="Street Lights"
                        class="image-card data-[index='4'] absolute w-[70%] md:w-3/5 h-auto rounded-2xl" data-index="5">
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    // Drain Animation Script
    document.addEventListener('DOMContentLoaded', () => {
        const navItems = gsap.utils.toArray('.nav-item');
        const imageCards = gsap.utils.toArray('.image-card');
        const activeBar = document.getElementById('active-bar');

        let activeIndex = 0; // Default active item

        // Base Y position for the active card (pushes it to the bottom)
        // 60% allows enough room above for the other cards to stack up without clipping
        const ACTIVE_Y_BASE = 60;

        const animProps = {
            duration: 0.7,
            ease: 'power3.inOut'
        };

        // Function to update the image stack based on the active index
        function updateActiveState(newIndex) {
            if (newIndex === activeIndex) return; // Do nothing if already active

            // Update active nav item styles
            navItems[activeIndex].classList.remove('text-custom-green');
            navItems[newIndex].classList.add('text-custom-green');

            activeIndex = newIndex;

            // Update Active Bar Immediately
            const activeNavItem = navItems[activeIndex];
            gsap.set(activeBar, {
                top: activeNavItem.offsetTop,
                height: activeNavItem.offsetHeight
            });

            // Apply subtle animation for visual feedback
            gsap.fromTo(activeBar,
                { scaleY: 0.8, opacity: 0.7 },
                {
                    scaleY: 1,
                    opacity: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                }
            );

            // Animate Image Stack
            imageCards.forEach((card, index) => {
                const stackPosition = index - activeIndex;
                const stackPositionAbs = Math.abs(stackPosition);

                if (stackPosition === 0) {
                    // Animate TO Active State (Bottom, Front)
                    gsap.to(card, {
                        zIndex: 10,
                        x: '0%',
                        y: ACTIVE_Y_BASE + '%', // Move to bottom
                        z: 0,
                        rotate: '0deg',
                        scale: 1,
                        ...animProps
                    });
                } else {
                    // Animate TO Inactive State (Staircase Up and Right)
                    gsap.to(card, {
                        zIndex: 5 - stackPositionAbs,
                        x: (stackPositionAbs * 15) + '%', // Move Right
                        y: (ACTIVE_Y_BASE - (stackPositionAbs * 15)) + '%', // Move Up relative to base
                        z: -(stackPositionAbs * 150),
                        scale: 1,
                        ...animProps
                    });
                }
            });
        }

        // Set Initial State
        function setInitialState() {
            // Set bar to first item
            gsap.set(activeBar, {
                top: navItems[0].offsetTop,
                height: navItems[0].offsetHeight
            });

            // Set initial card positions
            imageCards.forEach((card, index) => {
                const stackPosition = index - activeIndex;
                const stackPositionAbs = Math.abs(stackPosition);

                if (stackPosition === 0) {
                    gsap.set(card, {
                        zIndex: 10,
                        x: '0%',
                        y: ACTIVE_Y_BASE + '%', // Move to bottom
                        z: 0,
                        rotate: '0deg',
                        scale: 1
                    });
                } else {
                    gsap.set(card, {
                        zIndex: 5 - stackPositionAbs,
                        x: (stackPositionAbs * 15) + '%',
                        y: (ACTIVE_Y_BASE - (stackPositionAbs * 15)) + '%', // Move Up
                        z: -(stackPositionAbs * 150),
                        scale: 1
                    });
                }
            });
        }

        // Initialize the component
        setInitialState();

        // Set first nav item as active with custom-green color
        navItems[0].classList.add('text-custom-green');

        // Add Event Listeners
        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateActiveState(index);
            });
        });
    });
</script>

<!-- Eco Concrete Section -->
<section class="py-16 px-6 lg:px-12 flex items-center justify-center">
    <div class="relative max-w-7xl lg:w-[65%]  mx-auto">
        <img src="/static/images/Eco%20Concrete%20Intro%20Frame.webp" alt="Eco Concrete blocks stacked"
            class="w-full h-auto rounded-xl block hidden md:block">
        <img src="/static/images/Eco%20Concrete%20Mobile%20version.webp"
            class="md:hidden w-full rounded-xl max-h-screen object-contain"
            alt="Eco Concrete blocks stacked Mobile version">
    </div>
</section>

<!-- Carousel of project slides -->
<section class="relative h-screen w-full overflow-hidden bg-black" id="carousel_section">

    <div id="gokart-carousel-slides" class="h-full w-full relative">
        
        <div class="carousel-slide absolute inset-0 w-full h-full" data-index="0">

            <img src="/media/project_home_banners/ecopath_nestaira_desktop.webp" alt=""
                class="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105">

            <div class="absolute inset-0 bg-black/40"></div>

            <div class="max-w-7xl mx-auto absolute inset-0 z-20 w-full h-full pointer-events-none">
                <div
                    class="h-full w-full max-w-8xl mx-auto px-6 md:px-12 flex flex-col justify-center md:justify-center pt-20 md:pt-0">

                    <div
                        class="w-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16 pointer-events-auto">

                        <div class="w-full md:w-3/5 text-left">
                            <h2
                                class="text-2xl md:text-3xl lg:text-4xl font-product-sans font-black text-white leading-tight mb-4 md:mb-6 drop-shadow-lg">
                                Nesta Ira Estates – Where Every Road Leads to Better Choices
                            </h2>

                            <div
                                class="space-y-4 text-white/90 md:pr-8 max-h-[40vh] md:max-h-none overflow-y-auto md:overflow-visible no-scrollbar">
                                <p
                                    class="text-base md:text-lg font-montserrat font-normal text-white/90 leading-relaxed">
                                    In a quiet corner of Nesta Ira Estates, a residential layout in progress, we took on the responsibility of laying a road that didn’t just connect houses—it connected ideas of progress, sustainability, and innovation. While many roads are built with conventional practices, this one was different. Every layer was built with intention
                                </p>

                                <div class="space-y-4 mt-4">
                                    <div>
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">Scope
                                        </h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">Made the entire road infrasturcture of Nesta Ira Estates
                                        </p>
                                    </div>

                                    <div class="mt-2">
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">Tech Used
                                        </h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">GGBS | Eco Concrete</p>
                                    </div>

                                    <div class="mt-2">
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">
                                            Performance Impact</h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">Cut the cost by 20%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-2/5 flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                            <div
                                class="flex-1 bg-white/20 backdrop-blur-md text-white p-4 md:p-6 rounded-xl shadow-lg border border-white/10">
                                <div class="text-lg md:text-2xl font-montserrat font-normal">Cement Eliminated</div>
                                <div class="text-xl md:text-3xl font-product-sans font-black mt-1 md:mt-2">3,000 KGs</div>
                            </div>
                            <div
                                class="flex-1 bg-white/20 backdrop-blur-md text-white p-4 md:p-6 rounded-xl shadow-lg border border-white/10">
                                <div class="text-lg md:text-xl font-montserrat font-normal">Water Saved</div>
                                <div class="text-xl md:text-3xl font-product-sans font-black mt-1 md:mt-2">1,000 tons</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
        <div class="carousel-slide absolute inset-0 w-full h-full" data-index="1">

            <img src="/media/project_home_banners/ecopath_coevolve.webp" alt=""
                class="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105">

            <div class="absolute inset-0 bg-black/40"></div>

            <div class="max-w-7xl mx-auto absolute inset-0 z-20 w-full h-full pointer-events-none">
                <div
                    class="h-full w-full max-w-8xl mx-auto px-6 md:px-12 flex flex-col justify-center md:justify-center pt-20 md:pt-0">

                    <div
                        class="w-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16 pointer-events-auto">

                        <div class="w-full md:w-3/5 text-left">
                            <h2
                                class="text-2xl md:text-3xl lg:text-4xl font-product-sans font-black text-white leading-tight mb-4 md:mb-6 drop-shadow-lg">
                                Paving the Green Way: How CoEvolve Got a Road That Lasts
                            </h2>

                            <div
                                class="space-y-4 text-white/90 md:pr-8 max-h-[40vh] md:max-h-none overflow-y-auto md:overflow-visible no-scrollbar">
                                <p
                                    class="text-base md:text-lg font-montserrat font-normal text-white/90 leading-relaxed">
                                    EcoPath partnered with CoEvolve Estates to construct sustainable internal roads at their Whitefield, Bangalore, property using soil stabilisation and waterproofing techniques. By strengthening existing soil instead of replacing it, the project delivered a durable, weather-resistant road aligned with CoEvolve’s eco-conscious living philosophy—ensuring long-term performance with minimal environmental impact.
                                </p>

                                <div class="space-y-4 mt-4">
                                    <div>
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">Scope
                                        </h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">Entire road infrastructure
                                        </p>
                                    </div>

                                    <div class="mt-2">
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">Tech Used
                                        </h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">GGBS | Eco Concrete</p>
                                    </div>

                                    <div class="mt-2">
                                        <h5 class="text-xl md:text-2xl font-bold font-montserrat text-white">
                                            Performance Impact</h5>
                                        <p class="text-lg md:text-xl font-product-sans text-white/80">Cut the cost by 20%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-2/5 flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                            <div
                                class="flex-1 bg-white/20 backdrop-blur-md text-white p-4 md:p-6 rounded-xl shadow-lg border border-white/10">
                                <div class="text-lg md:text-2xl font-montserrat font-normal">Cement Eliminated</div>
                                <div class="text-xl md:text-3xl font-product-sans font-black mt-1 md:mt-2">500 KGs</div>
                            </div>
                            <div
                                class="flex-1 bg-white/20 backdrop-blur-md text-white p-4 md:p-6 rounded-xl shadow-lg border border-white/10">
                                <div class="text-lg md:text-xl font-montserrat font-normal">Water Saved</div>
                                <div class="text-xl md:text-3xl font-product-sans font-black mt-1 md:mt-2">100 tons</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
    </div>

    <button id="gokart-prev-btn"
        class="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
    </button>
    <button id="gokart-next-btn"
        class="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        
        <button
            class="gokart-dot-btn w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300 focus:outline-none"
            data-index="0"></button>
        
        <button
            class="gokart-dot-btn w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300 focus:outline-none"
            data-index="1"></button>
        
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const slides = document.querySelectorAll('#gokart-carousel-slides .carousel-slide');
            const prevBtn = document.getElementById('gokart-prev-btn');
            const nextBtn = document.getElementById('gokart-next-btn');
            const dotBtns = document.querySelectorAll('.gokart-dot-btn');

            let currentSlide = 0;
            const totalSlides = slides.length;
            let slideInterval;
            const slideDuration = 5000;

            function updateSlide(index) {
                slides.forEach((slide, i) => {
                    if (i === index) {
                        gsap.to(slide, { opacity: 1, duration: 0.5 });
                    } else {
                        gsap.to(slide, { opacity: 0, duration: 0.5 });
                    }
                });

                dotBtns.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.remove('bg-white/30', 'w-2', 'h-2', 'md:w-3', 'md:h-3');
                        dot.classList.add('bg-white', 'w-6', 'h-2', 'md:w-8', 'md:h-3', 'rounded-full');
                    } else {
                        dot.classList.remove('bg-white', 'w-6', 'h-2', 'md:w-8', 'md:h-3', 'rounded-full');
                        dot.classList.add('bg-white/30', 'w-2', 'h-2', 'md:w-3', 'md:h-3', 'rounded-full');
                    }
                });

                currentSlide = index;
            }

            function goToSlide(index) {
                currentSlide = (index + totalSlides) % totalSlides;
                updateSlide(currentSlide);
                resetSlideShow();
            }

            function goToNext() { goToSlide(currentSlide + 1); }
            function goToPrev() { goToSlide(currentSlide - 1); }

            function startSlideShow() { slideInterval = setInterval(goToNext, slideDuration); }
            function resetSlideShow() { clearInterval(slideInterval); startSlideShow(); }

            updateSlide(0);
            startSlideShow();

            prevBtn.addEventListener('click', goToPrev);
            nextBtn.addEventListener('click', goToNext);
            dotBtns.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.getAttribute('data-index')))));

            const carousel = document.querySelector('#carousel_section');
            carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carousel.addEventListener('mouseleave', () => resetSlideShow());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') goToPrev();
                if (e.key === 'ArrowRight') goToNext();
            });
        });
    </script>
</section>

<!--Calculator-->
<section class="py-12 px-4 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <div class="rounded-lg shadow-lg px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14 flex flex-col gap-8 lg:gap-10"
            style="background-image: url('/static/images/About%20timeline%20background.webp'); background-size: cover; background-position: center;">

            <div class="w-full gap-4">
                <h2 class="text-4xl md:text-4xl lg:text-5xl font-product-sans font-black text-custom-green py-8">
                    Measure Your Impact
                </h2>
                <p class="font-montserrat text-lg text-gray-700 max-w-3xl">
                    Compare EcoConcrete with traditional materials and see the carbon savings for your project with
                    our Carbon Calculator.
                </p>
            </div>

            <div class="w-full flex flex-col lg:flex-row gap-10 lg:gap-16">

                <div class="w-full lg:w-1/2">
                    <form id="impact-calculator-form" class="space-y-6" onsubmit="return false;">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-montserrat text-gray-700 mb-2">Product <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <select id="calc-product" onchange="updateFormFields()"
                                        class="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-8 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green appearance-none bg-white">
                                        <option value="Solid Block">Solid Block</option>
                                        <option value="Paver">Paver</option>
                                        <option value="Kerbstone">Kerbstone</option>
                                        <option value="Saucer Drain">Saucer Drain</option>
                                        <option value="U Drain">U Drain</option>
                                        <option value="Precast Slab">Precast Slab</option>
                                        <option value="Boundary Wall Panel">Boundary Wall Panel</option>
                                        <option value="Precast Road">Precast Road</option>
                                    </select>
                                    <span
                                        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs md:text-sm">▾</span>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-montserrat text-gray-700 mb-2">Grade (Optional)</label>
                                <div class="relative">
                                    <select id="calc-grade"
                                        class="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-8 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green appearance-none bg-white">
                                        <option value="Default">Default</option>
                                        <option value="M7.5">M7.5</option>
                                        <option value="M25">M25</option>
                                        <option value="M30">M30</option>
                                        <option value="M35">M35</option>
                                        <option value="M40">M40</option>
                                    </select>
                                    <span
                                        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs md:text-sm">▾</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div id="group-dim-1">
                                <label id="label-dim-1" class="block text-sm font-montserrat text-gray-700 mb-2">Length
                                    (mm) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" id="input-dim-1" placeholder="0" required
                                    class="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green">

                                <div id="udrain-size-wrapper" class="relative hidden">
                                    <select id="input-udrain-size"
                                        class="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-8 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green appearance-none bg-white">
                                        <option value="300x300">300 x 300 mm</option>
                                        <option value="450x450">450 x 450 mm</option>
                                        <option value="600x600">600 x 600 mm</option>
                                    </select>
                                    <span
                                        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs md:text-sm">▾</span>
                                </div>
                            </div>

                            <div id="group-dim-2">
                                <label id="label-dim-2" class="block text-sm font-montserrat text-gray-700 mb-2">Width
                                    (mm) <span class="text-red-500">*</span></label>
                                <input type="number" step="0.01" id="input-dim-2" placeholder="0" required
                                    class="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green">

                                <div id="area-unit-wrapper" class="relative hidden">
                                    <select id="input-area-unit"
                                        class="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-8 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green appearance-none bg-white">
                                        <option value="sqm">Square Meters (m²)</option>
                                        <option value="sqft">Square Feet (ft²)</option>
                                    </select>
                                    <span
                                        class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs md:text-sm">▾</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label id="label-thickness"
                                    class="block text-sm font-montserrat text-gray-700 mb-2">Thickness (mm) <span
                                        class="text-red-500">*</span></label>
                                <div class="relative">
                                    <input type="number" id="input-thickness" placeholder="mm" required
                                        class="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green">

                                    <select id="select-thickness"
                                        class="hidden w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-8 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green appearance-none bg-white">
                                    </select>
                                    <span id="arrow-thickness"
                                        class="hidden pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-xs md:text-sm">▾</span>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-montserrat text-gray-700 mb-2">Quantity (Nos) <span
                                        class="text-red-500">*</span></label>
                                <input type="number" id="input-quantity" placeholder="1" required
                                    class="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm md:text-base font-montserrat text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-custom-green">
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 mt-4">
                            <button type="button" onclick="calculateImpact()"
                                class="flex-1 bg-custom-green text-white font-montserrat font-semibold py-2.5 rounded-lg text-sm md:text-base hover:bg-green-800 transition-colors">
                                Calculate
                            </button>
                            <button type="button" onclick="resetCalculator()"
                                class="flex-1 bg-gray-200 text-gray-800 font-montserrat font-semibold py-2.5 rounded-lg text-sm md:text-base hover:bg-gray-300 transition-colors">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div class="w-full lg:w-1/2 flex flex-col">
                    <div class="grid grid-cols-1 gap-4 sm:gap-5">
                        <div class="grid grid-cols-2 gap-2 bg-card-bg-green rounded-xl py-6 px-5 text-white font-montserrat text-2xl md:text-3xl"
                            style="box-shadow: 6px 10px 3px rgba(0,0,0,0.05) inset;">
                            <span class="font-semibold text-lg md:text-xl self-center">CO<sub>2</sub> saved</span>
                            <span class="font-semibold text-right flex justify-end items-center"><span
                                    id="res-co2">0</span>&nbsp;<span
                                    class="text-sm md:text-lg self-end mb-1">tonnes</span></span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 bg-card-bg-green rounded-xl py-6 px-5 text-white font-montserrat text-2xl md:text-3xl"
                            style="box-shadow: 6px 10px 3px rgba(0,0,0,0.05) inset;">
                            <span class="font-semibold text-lg md:text-xl self-center">Water saved</span>
                            <span class="font-semibold text-right flex justify-end items-center"><span
                                    id="res-water">0</span>&nbsp;<span
                                    class="text-sm md:text-lg self-end mb-1">litres</span></span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 bg-card-bg-dark-green rounded-xl py-6 px-5 text-white font-montserrat text-2xl md:text-3xl"
                            style="box-shadow: 6px 10px 3px rgba(0,0,0,0.05) inset;">
                            <span class="font-semibold text-lg md:text-xl self-center">Industrial waste used</span>
                            <span class="font-semibold text-right flex justify-end items-center"><span
                                    id="res-waste">0</span>&nbsp;<span
                                    class="text-sm md:text-lg self-end mb-1">tonnes</span></span>
                        </div>
                    </div>
                </div>

            </div>

            <div
                class="mt-4 bg-white/95 rounded-xl py-4 px-6 flex flex-col gap-4 text-sm md:text-base font-montserrat text-gray-800">
                <div class="flex items-start gap-3">
                    <span class="text-2xl">🌳</span>
                    <p class="leading-relaxed">Equivalent to planting <span id="res-trees"
                            class="font-bold text-custom-green">0</span> trees per year.</p>
                </div>
                <div class="flex items-start gap-3">
                    <span class="text-2xl">🚗</span>
                    <p class="leading-relaxed">Comparable to eliminating <span id="res-cars"
                            class="font-bold text-custom-green">0</span> km of car travel.</p>
                </div>
                <div class="flex items-start gap-3">
                    <span class="text-2xl">📱</span>
                    <p class="leading-relaxed">Equal to <span id="res-phones"
                            class="font-bold text-custom-green">0</span> smartphone charges.</p>
                </div>
                <div class="flex items-start gap-3">
                    <span class="text-2xl">💧</span>
                    <p class="leading-relaxed">Water for <span id="res-urban"
                            class="font-bold text-custom-green">0</span> days (Urban) or <span id="res-rural"
                            class="font-bold text-custom-green">0</span> days (Rural) households.</p>
                </div>
            </div>

        </div>
    </div>
</section>

<script>
    // --- 1. CONFIGURATION DATA ---
    const UI_CONFIG = {
        "Solid Block": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Height (mm)", t_options: null },
        "Paver": { type: "area", t_label: "Thickness (mm)", t_options: [60, 80, 100] },
        "Kerbstone": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: null },
        "Saucer Drain": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: null },
        "U Drain": { type: "udrain", t_label: "Wall Thickness (mm)", t_options: [100, 125, 150] },
        "Precast Slab": { type: "dims", l_label: "Length (mm)", w_label: "Width (mm)", t_label: "Thickness (mm)", t_options: [100, 125, 150, 200] },
        "Boundary Wall Panel": { type: "dims", l_label: "Length (mm)", w_label: "Height (mm)", t_label: "Thickness (mm)", t_options: [100, 125, 150] },
        "Precast Road": { type: "area", t_label: "Thickness (mm)", t_options: [125, 150, 175, 200, 250] },
    };

    const CEMENT_KG_PER_M3 = {
        "M7.5": 220, "M25": 320, "M30": 340, "M35": 380, "M40": 400
    };

    const DEFAULT_GRADE = {
        "Solid Block": "M7.5", "Paver": "M35", "Kerbstone": "M25",
        "Saucer Drain": "M25", "U Drain": "M30", "Precast Slab": "M30",
        "Boundary Wall Panel": "M30", "Precast Road": "M40"
    };

    // Constants
    const EF_CEMENT = 0.9;
    const REDUCTION_FACTOR = 0.75;
    const WATER_PER_M2_CURING = 70;
    const URBAN_HH_L_PER_DAY = 540;
    const RURAL_HH_L_PER_DAY = 220;
    const EF_CAR_KM = 0.18;
    const EF_TREE_PER_YEAR = 22;
    const EF_PHONE_CHARGE = 0.0082;

    // --- 2. UPDATE UI FUNCTION ---
    function updateFormFields() {
        const product = document.getElementById('calc-product').value;
        const config = UI_CONFIG[product] || UI_CONFIG["Solid Block"];

        const label1 = document.getElementById('label-dim-1');
        const input1 = document.getElementById('input-dim-1');
        const uDrainSelect = document.getElementById('udrain-size-wrapper');

        const label2 = document.getElementById('label-dim-2');
        const input2 = document.getElementById('input-dim-2');
        const unitSelect = document.getElementById('area-unit-wrapper');

        const labelThick = document.getElementById('label-thickness');
        const inputThick = document.getElementById('input-thickness');
        const selectThick = document.getElementById('select-thickness');
        const arrowThick = document.getElementById('arrow-thickness');

        // Clear errors
        document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

        // Reset visibility
        input1.classList.remove('hidden');
        uDrainSelect.classList.add('hidden');
        input2.classList.remove('hidden');
        unitSelect.classList.add('hidden');
        inputThick.classList.remove('hidden');
        selectThick.classList.add('hidden');
        arrowThick.classList.add('hidden');

        // Apply Logic
        if (config.type === 'area') {
            label1.textContent = "Area";
            label2.textContent = "Unit";
            input2.classList.add('hidden');
            unitSelect.classList.remove('hidden');
        }
        else if (config.type === 'udrain') {
            label1.textContent = "Internal Size";
            input1.classList.add('hidden');
            uDrainSelect.classList.remove('hidden');
            label2.textContent = "";
            input2.classList.add('hidden');
        }
        else {
            label1.textContent = config.l_label;
            label2.textContent = config.w_label;
        }

        labelThick.textContent = config.t_label;
        if (config.t_options) {
            inputThick.classList.add('hidden');
            selectThick.classList.remove('hidden');
            arrowThick.classList.remove('hidden');
            selectThick.innerHTML = "";
            config.t_options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.text = opt + " mm";
                selectThick.appendChild(option);
            });
        }
    }

    // --- 3. VALIDATION ---
    function validateInputs() {
        let isValid = true;
        const requiredIds = ['input-quantity'];

        // Add visible dimensions to validation list
        if (!document.getElementById('input-dim-1').classList.contains('hidden')) requiredIds.push('input-dim-1');
        if (!document.getElementById('input-dim-2').classList.contains('hidden')) requiredIds.push('input-dim-2');
        if (!document.getElementById('input-thickness').classList.contains('hidden')) requiredIds.push('input-thickness');

        requiredIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value || parseFloat(el.value) <= 0) {
                el.classList.add('border-red-500'); // Add red border
                isValid = false;
            } else {
                el.classList.remove('border-red-500');
            }
        });

        if (!isValid) {
            alert("Please fill in all mandatory fields with valid numbers.");
        }
        return isValid;
    }

    // --- 4. CALCULATION LOGIC ---
    function calculateImpact() {
        if (!validateInputs()) return;

        const product = document.getElementById('calc-product').value;
        const gradeInput = document.getElementById('calc-grade').value;
        const quantity = parseFloat(document.getElementById('input-quantity').value) || 0;

        let grade = gradeInput;
        if (grade === "Default" || !grade) {
            grade = DEFAULT_GRADE[product] || "M30";
        }

        let total_volume_m3 = 0.0;
        let total_curing_area_m2 = 0.0;

        // DIVIDE INPUTS BY 1000 TO CONVERT MM TO M
        if (product === "Solid Block") {
            const L = (parseFloat(document.getElementById('input-dim-1').value) || 0) / 1000.0;
            const B = (parseFloat(document.getElementById('input-dim-2').value) || 0) / 1000.0;
            const H = (parseFloat(document.getElementById('input-thickness').value) || 0) / 1000.0;

            total_volume_m3 = (L * B * H) * quantity;
            total_curing_area_m2 = (L * B) * quantity;
        }
        else if (product === "Paver" || product === "Precast Road") {
            const areaVal = parseFloat(document.getElementById('input-dim-1').value) || 0;
            const unit = document.getElementById('input-area-unit').value;
            const thickness_mm = parseFloat(document.getElementById('select-thickness').value) || 0;

            let area_m2 = (unit === "sqft") ? areaVal * 0.092903 : areaVal;
            let thickness_m = thickness_mm / 1000.0;

            total_volume_m3 = area_m2 * thickness_m;
            total_curing_area_m2 = area_m2;
        }
        else if (product === "Kerbstone" || product === "Saucer Drain") {
            const L = (parseFloat(document.getElementById('input-dim-1').value) || 0) / 1000.0;
            const B = (parseFloat(document.getElementById('input-dim-2').value) || 0) / 1000.0;
            const H = (parseFloat(document.getElementById('input-thickness').value) || 0) / 1000.0;

            total_volume_m3 = (L * B * H) * quantity;
            total_curing_area_m2 = (L * H) * quantity;
        }
        else if (product === "U Drain") {
            const sizeStr = document.getElementById('input-udrain-size').value;
            const parts = sizeStr.split('x');
            const inner_w_mm = parseFloat(parts[0]);
            const inner_h_mm = parseFloat(parts[1]);
            const wall_mm = parseFloat(document.getElementById('select-thickness').value) || 0;

            const L_drain = 2.0;
            const inner_w_m = inner_w_mm / 1000.0;
            const inner_h_m = inner_h_mm / 1000.0;
            const t_m = wall_mm / 1000.0;

            const outer_w_m = inner_w_m + (2 * t_m);
            const outer_h_m = inner_h_m + t_m;

            const outer_area = outer_w_m * outer_h_m;
            const inner_area = inner_w_m * inner_h_m;
            const section_area = outer_area - inner_area;

            total_volume_m3 = (section_area * L_drain) * quantity;
            total_curing_area_m2 = (inner_w_m * L_drain) * quantity;
        }
        else if (product === "Precast Slab" || product === "Boundary Wall Panel") {
            const L = (parseFloat(document.getElementById('input-dim-1').value) || 0) / 1000.0;
            const B = (parseFloat(document.getElementById('input-dim-2').value) || 0) / 1000.0;
            const thick_mm = parseFloat(document.getElementById('select-thickness').value) || 0;
            const thick_m = thick_mm / 1000.0;

            total_volume_m3 = (L * B * thick_m) * quantity;
            total_curing_area_m2 = (L * B) * quantity;
        }

        // --- MATHS ---
        const cement_per_m3 = CEMENT_KG_PER_M3[grade] || 340;
        const cement_mass_kg = total_volume_m3 * cement_per_m3;
        const conventional_co2_kg = cement_mass_kg * EF_CEMENT;
        const co2_saved_kg = conventional_co2_kg * REDUCTION_FACTOR;
        const co2_saved_tonnes = co2_saved_kg / 1000.0;

        const water_saved_liters = total_curing_area_m2 * WATER_PER_M2_CURING;
        const urban_days = water_saved_liters / URBAN_HH_L_PER_DAY;
        const rural_days = water_saved_liters / RURAL_HH_L_PER_DAY;

        const car_km = co2_saved_kg / EF_CAR_KM;
        const trees = co2_saved_kg / EF_TREE_PER_YEAR;
        const phones = co2_saved_kg / EF_PHONE_CHARGE;
        const waste_tonnes = (cement_mass_kg * REDUCTION_FACTOR) / 1000.0;

        // --- UPDATE UI WITH SMART ROUNDING ---
        // If value is small but positive, show 4 decimals. Otherwise show 2.

        // Helper to format text
        const fmt = (val) => {
            let decimals = val > 0 && val < 0.01 ? 4 : 2;
            return val.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        };
        document.getElementById('res-co2').innerText = fmt(co2_saved_tonnes);
        document.getElementById('res-waste').innerText = fmt(waste_tonnes);

        // Water, Trees, Cars, and Phones (Whole numbers with commas)
        document.getElementById('res-water').innerText = Math.round(water_saved_liters).toLocaleString('en-US');
        document.getElementById('res-trees').innerText = Math.round(trees).toLocaleString('en-US');
        document.getElementById('res-cars').innerText = Math.round(car_km).toLocaleString('en-US');
        document.getElementById('res-phones').innerText = Math.round(phones).toLocaleString('en-US');

        // Days (1 decimal place with commas)
        document.getElementById('res-urban').innerText = urban_days.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        document.getElementById('res-rural').innerText = rural_days.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function resetCalculator() {
        document.getElementById('impact-calculator-form').reset();
        document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
        updateFormFields();
        document.getElementById('res-co2').innerText = "0";
        document.getElementById('res-water').innerText = "0";
        document.getElementById('res-waste').innerText = "0";
        document.getElementById('res-trees').innerText = "0";
        document.getElementById('res-cars').innerText = "0";
        document.getElementById('res-phones').innerText = "0";
        document.getElementById('res-urban').innerText = "0";
        document.getElementById('res-rural').innerText = "0";
    }

    document.addEventListener('DOMContentLoaded', updateFormFields);
</script>

<!-- Clientele Section -->
<section class="w-100 pt-10">
    <div class="w-full h-full bg-[#E6E6DF] py-16 px-6 lg:px-12">
        <!-- Top Part: Title + Testimonials -->
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-8">
            <div class="lg:w-2/5 text-center lg:text-left lg:mt-8">
                <p class="font-montserrat text-custom-green font-semibold text-lg">CLIENTELE</p>
                <h2 class="text-3xl md:text-4xl font-product-sans font-black text-custom-green mt-4">What people say<br>
                    about us?</h2>
            </div>
            <div class="lg:w-3/5 relative overflow-y-auto pb-4 [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <div class="flex gap-8 flex-nowrap">
                    
                    <div class="testimonial-card flex-shrink-0 w-[90%] sm:w-[35rem] bg-white p-8 rounded-br-[3rem] rounded-tl-[3rem] shadow-md">
                        <div class="flex items-start gap-4">
                            
                            <img src="/media/homepage_testimonials/bierlibrary.webp" alt="Gitanshu Gupta"
                                class="w-14 h-14 rounded-full object-cover">
                            
                            <div>
                                <h3 class="font-product-sans font-bold text-lg">Gitanshu Gupta</h3>
                                <p class="font-montserrat text-sm text-gray-600">CEO</p>
                            </div>
                        </div>
                        <p class="font-montserrat text-gray-700 mt-4">
                            We make the best bier and they  make the best roads. We are really impressed by their work and dedication to sustainability. Hats Off!
                        </p>
                    </div>
                    
                    <div class="testimonial-card flex-shrink-0 w-[90%] sm:w-[35rem] bg-white p-8 rounded-br-[3rem] rounded-tl-[3rem] shadow-md">
                        <div class="flex items-start gap-4">
                            
                            <img src="/media/homepage_testimonials/square-image.webp" alt="Suchita Haldar"
                                class="w-14 h-14 rounded-full object-cover">
                            
                            <div>
                                <h3 class="font-product-sans font-bold text-lg">Suchita Haldar</h3>
                                <p class="font-montserrat text-sm text-gray-600">CEO</p>
                            </div>
                        </div>
                        <p class="font-montserrat text-gray-700 mt-4">
                            We really got the best quotation. The quality of work is commendable. Great job Eco Path!
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>

        <!-- Bottom Part: Client Logos -->
        <div class="mt-24 relative overflow-hidden h-20">
            <div class="client-logo-scroller w-max flex items-center h-full gap-x-16 sm:gap-x-24">
                
                
                <img src="/media/clientele_logos/logo.webp" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="Co Evolve">
                
                
                
                <img src="/media/clientele_logos/logo-2-3.png" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="H">
                
                
                
                <img src="/media/clientele_logos/elv_group_logo-2.png" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="ELV">
                
                
                
                <img src="/media/clientele_logos/Web_capture_3-6-2022_103013_-removebg-preview.png" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="NN">
                
                
                
                <img src="/media/clientele_logos/TBL-LOGO_1-1.webp" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="Bier Library">
                
                
                
                <img src="/media/clientele_logos/Gemini_Generated_Image_qus4kaqus4kaqus4.png" class="client-logo h-12 sm:h-16 w-auto object-contain"
                    alt="Indian Army">
                
                
            </div>
        </div>
    </div>
</section>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        function createInfiniteScroller(scrollerSelector, itemsSelector, duration, isVertical = false) {
            const scroller = document.querySelector(scrollerSelector);
            if (!scroller) return;

            const items = Array.from(scroller.querySelectorAll(itemsSelector));
            items.forEach(item => scroller.appendChild(item.cloneNode(true)));

            const scrollerWidth = items.reduce((acc, item) => acc + item.offsetWidth + parseInt(getComputedStyle(item).marginRight || 0), 0);

            gsap.to(scroller, {
                x: -scrollerWidth,
                duration: duration,
                ease: 'none',
                repeat: -1,
            });
        }

        createInfiniteScroller('.client-logo-scroller', '.client-logo', 25);

        // Hero Section Animation Logic
        const slides = gsap.utils.toArray(".hero-slide");
        const dots = gsap.utils.toArray(".hero-dot");
        const navGroups = gsap.utils.toArray(".hero-nav-group");
        const totalSlides = slides.length;
        let currentSlide = 0;
        let slideInterval;
        const slideDuration = 4000;
        const fadeDuration = 1;

        function updateIndicators() {
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentSlide);
            });
        }

        function animateSlides(oldSlideIndex, newSlideIndex) {
            gsap.to(slides[oldSlideIndex], {
                opacity: 0,
                duration: fadeDuration,
                ease: "power1.inOut"
            });
            gsap.to(slides[newSlideIndex], {
                opacity: 1,
                duration: fadeDuration,
                ease: "power1.inOut"
            });

            const oldGroup = navGroups[oldSlideIndex];
            const newGroup = navGroups[newSlideIndex];
            const oldItems = oldGroup.children;
            const newItems = newGroup.children;

            gsap.set(newGroup, { opacity: 1 });

            gsap.to(oldItems, {
                opacity: 0,
                yPercent: () => (Math.random() > 0.5 ? 100 : -100),
                stagger: 0.05,
                duration: fadeDuration * 0.5,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set(oldGroup, { opacity: 0 });
                }
            });

            gsap.fromTo(newItems,
                {
                    opacity: 0,
                    yPercent: () => (Math.random() > 0.5 ? 100 : -100)
                },
                {
                    opacity: 1, // Changed to 1 for black text
                    yPercent: 0,
                    stagger: 0.05,
                    duration: fadeDuration,
                    delay: fadeDuration * 0.2,
                    ease: "power2.out"
                }
            );
        }

        function showNextSlide() {
            const oldSlideIndex = currentSlide;
            currentSlide = (currentSlide + 1) % totalSlides;
            animateSlides(oldSlideIndex, currentSlide);
            updateIndicators();
        }

        function goToSlide(index) {
            if (index === currentSlide) return;
            const oldSlideIndex = currentSlide;
            currentSlide = index;
            animateSlides(oldSlideIndex, currentSlide);
            updateIndicators();
            clearInterval(slideInterval);
            slideInterval = setInterval(showNextSlide, slideDuration);
        }

        gsap.set(slides[currentSlide], { opacity: 1 });
        updateIndicators();

        navGroups.forEach((group, index) => {
            const items = group.children;
            if (index === currentSlide) {
                gsap.set(group, { opacity: 1 });
                gsap.set(items, { opacity: 1, yPercent: 0 }); // Changed to 1 for black text
            } else {
                gsap.set(group, { opacity: 0 });
                gsap.set(items, { opacity: 0, yPercent: 100 });
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goToSlide(index);
            });
        });

        slideInterval = setInterval(showNextSlide, slideDuration);
    });    
</script>

    </div>

    <!-- <footer class="w-full bg-[#17411A] font-product-sans text-white px-8 py-12 md:px-16 md:py-20 overflow-hidden relative mx-auto">
    
    <div class="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
        
        <div class="lg:w-1/2">
            <p class="text-green-200 font-bold text-xs tracking-widest uppercase mb-6">Contact Us</p>
            
            <h2 class="text-4xl md:text-6xl font-medium leading-[1.1] mb-10">
                Let’s Discuss Your <br /> Vision. With Us
            </h2>

            <a href="#" class="group bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 transition-transform hover:scale-105">
                Schedule a call now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>

            <div class="mt-12">
                <p class="text-green-200/80 text-xs font-bold uppercase tracking-widest mb-4">Or Email Us At</p>
                <div class="inline-flex items-center gap-3 bg-[#ffffff08] border border-[#ffffff15] rounded-full px-6 py-3 group cursor-pointer hover:border-[#ffffff30] transition-colors">
                    <span class="text-gray-200 font-light">contactus@ecopath.com</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-white transition-colors"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </div>
            </div>
        </div>

        <div class="lg:w-1/2 flex gap-12 md:gap-24 lg:justify-end">
            <div>
                <h3 class="text-green-200/80 font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h3>
                <ul class="space-y-4">
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Case Studies</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Gallery</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Blogs</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">About Me</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-green-200/80 font-bold text-sm uppercase tracking-widest mb-6">Information</h3>
                <ul class="space-y-4">
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Terms of Service</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a></li>
                    <li><a href="#" class="text-gray-300 hover:text-white transition-colors text-sm font-medium">Cookies Settings</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="h-px bg-[#ffffff15] w-full my-12"></div>

    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            &copy; Xavierdubois 2024. All rights reserved.
        </p>

        <div class="flex gap-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
        </div>
    </div>

</footer> -->

    <footer
        class="w-full bg-[#17411A] font-product-sans text-white px-8 py-12 md:px-16 md:py-20 overflow-hidden relative mx-auto">

        <div class="max-w-[1400px] mx-auto">

            <div class="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">

                <div class="lg:w-1/2">
                    <p class="text-green-200 font-bold text-md tracking-wider uppercase mb-6">Contact Us</p>

                    <h2 class="text-4xl md:text-6xl font-semibold leading-[1.1] mb-10">
                        Let’s Discuss Your <br /> Vision. With Us
                    </h2>

                    <a href="/contact/"
                        class="group bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 transition-transform hover:scale-105">
                        Schedule a call now
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                            class="group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </a>

                    <div class="mt-12">
                        <p class="text-green-200/80 text-md font-bold uppercase tracking-wider mb-4">Or Email Us At</p>
                        <div id="copy-container" onclick="copyEmail()"
                            class="inline-flex items-center gap-3 bg-[#ffffff08] border border-[#ffffff15] rounded-full px-6 py-3 group cursor-pointer hover:border-[#ffffff30] transition-colors relative">

                            <span id="email-text" class="text-gray-200 font-medium">contactus@ecopath.com</span>

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-gray-400 group-hover:text-white transition-colors">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>

                            <span id="copy-tooltip"
                                class="absolute -top-8 left-1/2 -translate-x-1/2 bg-custom-green text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity">
                                Copied!
                            </span>
                        </div>
                    </div>
                </div>

                <div class="lg:w-1/2 flex gap-12 md:gap-24 lg:justify-end">

                    <div>
                        <h3 class="text-green-200/80 font-bold text-md uppercase tracking-wider mb-6">Quick Links</h3>
                        <ul class="space-y-4">
                            <li><a href="/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Home</a>
                            </li>
                            <li><a href="/sustainability/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Sustainability</a>
                            </li>
                            <li><a href="/about/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">About
                                    Us</a></li>
                            <li><a href="/blog/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Blogs</a>
                            </li>
                            <li><a href="/contact/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Contact
                                    Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-green-200/80 font-bold text-md uppercase tracking-wider mb-6">What We Do</h3>
                        <ul class="space-y-4">
                            <li><a href="/technology-products/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Technology
                                    & Products</a></li>
                            <li><a href="/services/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Services</a>
                            </li>
                            <li><a href="/projects/"
                                    class="text-gray-300 hover:text-white transition-colors text-base font-medium">Our
                                    Projects</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="h-px bg-[#ffffff15] w-full my-12"></div>

            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    &copy; Ecopath 2024. All rights reserved.
                </p>

                <div class="flex gap-6">
                    <!-- <a href="#" class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                    </a> -->
                    <a href="https://www.instagram.com/ecopath.earth/"
                        class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/ecopath-earth/?originalSubdomain=in"
                        class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                </div>
            </div>

        </div>
    </footer>



    <script>

        function copyEmail() {
            // Get the text from the span
            const emailText = document.getElementById('email-text').innerText;
            const tooltip = document.getElementById('copy-tooltip');

            // Copy to clipboard
            navigator.clipboard.writeText(emailText).then(() => {
                // Visual feedback: Show the "Copied!" tooltip
                tooltip.classList.remove('opacity-0');
                tooltip.classList.add('opacity-100');

                // Hide it again after 2 seconds
                setTimeout(() => {
                    tooltip.classList.remove('opacity-100');
                    tooltip.classList.add('opacity-0');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }



        $(document).ready(function () {
            // Navbar Scroll Logic
            let lastScrollTop = 0;
            const navbar = document.getElementById('main-navbar');
            const scrollThreshold = 100;

            window.addEventListener('scroll', function () {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Hide on scroll down, Show on scroll up
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }

                // Add Shadow on scroll
                if (scrollTop > 20) {
                    navbar.classList.add('shadow-lg', 'bg-white/95');
                } else {
                    navbar.classList.remove('shadow-lg');
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, false);

            // Mobile Menu
            $('#hamburger-btn').click(() => { $('#mobile-menu').removeClass('translate-x-full'); $('body').addClass('overflow-hidden'); });
            $('#close-btn').click(() => { $('#mobile-menu').addClass('translate-x-full'); $('body').removeClass('overflow-hidden'); });

            // Dropdown Accordion
            $('#mobile-dropdown-btn').click(function () {
                const content = $('#mobile-dropdown-content');
                const icon = $('#mobile-dropdown-icon');
                if (content.hasClass('max-h-0')) {
                    content.removeClass('max-h-0 opacity-0').addClass('max-h-[500px] opacity-100 mt-2');
                    icon.addClass('rotate-180');
                } else {
                    content.addClass('max-h-0 opacity-0').removeClass('max-h-[500px] opacity-100 mt-2');
                    icon.removeClass('rotate-180');
                }
            });
        });
    </script>
</body>

</html>