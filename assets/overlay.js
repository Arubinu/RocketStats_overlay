/// Do not modify this script for the correct operation of the overlay ///
let delay = 0;
let theme = '';
let mmrwchange = true;
let occasionnal = '';

// Read the options added in the page address
let options = {};
for ( let option of window.location.search.substring( 1 ).split( '&' ) )
{
	let split = option.split( '=' );
	if ( split.length <= 1 || !split[ 0 ] )
		continue ;

	let value = split.slice( 1 ).join( '=' );
	if ( value )
		options[ split[ 0 ] ] = value;
}

// The elements to create while respecting the order
let sort = [
	'RocketStats_Rank',	'RocketStats_GameMode',
	'Icon_MMR',			'RocketStats_MMR',		'RocketStats_MMRChange',
	'Icon_Win',			'RocketStats_Win',
	'Icon_Loss',		'RocketStats_Loss',
	'Icon_Streak',		'RocketStats_Streak'
];

// Adding static or loaded elements from text files to the overlay
let files = {
	'Icon_MMR': { static: true, type: 'img', attributes: { src: './assets/mmr.png' } },
	'Icon_Win': { static: true, type: 'img', attributes: { src: './assets/win.png' } },
	'Icon_Loss': { static: true, type: 'img', attributes: { src: './assets/loss.png' } },
	'Icon_Streak': { static: true, type: 'img', attributes: { src: './assets/streak.png' } },
	'RocketStats_GameMode': { default: '' },
	'RocketStats_Rank': { type: 'img', default: 'Unranked', value: '', update: ( file, content, init ) => {
		const change = value => {
			if ( file.last !== null && value == file.last )
				return ;

			file.last = value;
			let rankValue = (value || file.default).trim();

			// Convert Latin numbers to Romen numbers
			const romanMap = {
  			'1': 'I',
    		'2': 'II',
    		'3': 'III',
    		'4': 'IV'
			};
			rankValue = rankValue.replace(/(\d+)/, (_, num) => romanMap[num] || num);

			// Convert spaces to underscore
			rankValue = rankValue.replace(/\s+/g, '_');
			
			file.elem.src = `../RocketStats_images/${rankValue}.png`;
		};

		if ( init )
		{
			file.last = null;
			file.elem.onerror = () => {
				change();
			};
		}

		if ( occasionnal && [ 'Standard', 'Duel', 'Doubles', 'Chaos' ].indexOf( content ) >= 0 )
			content = occasionnal;

		change( content );
	} }
};

// Returns the requested option or the `base` parameter
function getOption( name, base )
{
	return ( ( typeof( options[ name ] ) === 'undefined' ) ? base : options[ name ] );
}

// Read a text file (only works on OBS)
function readTextFile( file )
{
	return new Promise( ( resolve, reject ) => {
		var request = new XMLHttpRequest();
		request.open( 'GET', file, true );

		request.onreadystatechange = () => {
			if ( request.readyState === 4 )
			{
				if ( request.status === 200 || request.status == 0 )
					resolve( request.responseText );
				else
					reject( request );
			}
		}

		request.overrideMimeType( 'text/plain' );
		request.send( null );
	} );
}

// Returns the object containing all the information about the file and its element
function getFileObject( name )
{
	let elem = document.querySelector( `[file-target="${name}"]` );
	if ( !elem )
		return ;

	let file = { default: '0', value: '', update: null };
	let file_type = typeof( files[ name ] );
	if ( file_type !== 'undefined' && files[ name ] !== true )
		file = files[ name ];

	let hide = ( file === false );
	elem.style.display = ( hide ? 'none' : null );
	if ( hide )
		return ;

	if ( file_type !== 'object' )
		files[ name ] = file;

	file.elem = elem;
	file.name = name;
	return ( file );
}

// Initializes the connection to the socket server
function socketConnect()
{
	import( 'http://localhost:3000/socket.io/socket.io.js' ).then( module => {
		const socket = io();

		socket.on( 'files', files => {
			console.log( 'files:', files );
			for ( let name in files )
			{
				console.log( 'files:', 'for', name );
				let file = getFileObject( name );
				if ( file )
					updateElement( file, files[ name ], true );
			}
		} );

		socket.on( 'file', data => {
			console.log( 'file:', data );
			let file = getFileObject( data.name );
			if ( file )
				updateElement( file, data.content )
		} );
	} );
}

// All that will be done after the page loads
function initOverlay()
{
	readTextFile( `./config.json` ).then( content => {
		try
		{
			let data = JSON.parse( content );
			delay = data.delay;
			theme = data.theme;
			mmrwchange = data.mmrwchange;
			occasionnal = data.occasionnal;

			if ( typeof( delay ) !== 'number' || delay <= 0 || typeof( theme ) !== 'string' || typeof( mmrwchange ) !== 'boolean' || typeof( occasionnal ) !== 'string' )
				throw '';
		}
		catch ( error )
		{
			console.error( error );
			document.body.innerText = 'The configuration file is wrong !';
			return ;
		}

		const next = () => {
			// Creation of elements
			let container = document.querySelector( '#container' );
			for ( let name of sort )
			{
				let file_type = typeof( files[ name ] );
				let type = ( ( file_type === 'object' && typeof( files[ name ].type ) === 'string' ) ? files[ name ].type : 'div' );

				let is_mmr = ( [ 'RocketStats_MMR', 'RocketStats_MMRChange' ].indexOf( name ) >= 0 );
				if ( is_mmr && mmrwchange && !document.querySelector( '.mmrwchange' ) )
				{
					let elem = document.createElement( 'div' );
					elem.classList.add( 'mmrwchange' );
					container.appendChild( elem );
				}

				let elem = document.createElement( type );
				let file_attr = ( ( file_type !== 'object' || typeof( files[ name ].static ) === 'undefined' || !files[ name ].static ) ? 'file-target' : 'file-static' );
				elem.setAttribute( file_attr, name );

				if ( file_type === 'object' && typeof( files[ name ].value ) === 'string' )
				{
					if ( [ 'audio', 'video' ].indexOf( type ) >= 0 )
					{
						elem.src = files[ name ].value;
						elem.loop = true;
						elem.autoplay = true;
					}
					else if ( type == 'input' )
						elem.value = files[ name ].value;
					else
						elem.innerText = files[ name ].value;
				}

				if ( file_type === 'object' && typeof( files[ name ].attributes ) === 'object' )
				{
					for ( attribute in files[ name ].attributes )
						elem.setAttribute( attribute, files[ name ].attributes[ attribute ] );
				}

				if ( is_mmr && mmrwchange )
					document.querySelector( '.mmrwchange' ).appendChild( elem );
				else
					container.appendChild( elem );
			}

			// Performs a theme function, specifying that items are available
			if ( typeof( window[ 'themeInit' ] ) === 'function' )
				window[ 'themeInit' ]();

			// Starts the overlay update
			updateOverlay( true );
			setInterval( updateOverlay, delay );

			// Displays the overlay elements
			document.body.classList.remove( 'hide' );
		};

		// Define the "delay" variable according to the options present in the URL
		if ( getOption( 'delay' ) && !isNaN( parseInt( options.delay ) ) )
			delay = parseInt( options.delay );

		// Define the "occasionnal" variable according to the options present in the URL
		occasionnal = ( getOption( 'occasionnal' ) || occasionnal );

		// Add the files of the chosen theme from the option present in the URL
		theme = ( getOption( 'theme' ) || theme );
		if ( theme )
		{
			let theme_style = document.createElement( 'link' );
			theme_style.setAttribute( 'rel', 'stylesheet' );
			theme_style.setAttribute( 'type', 'text/css' );
			theme_style.setAttribute( 'href', `./themes/${theme}/style.css` );
			document.head.appendChild( theme_style );

			const loadScript = () => {
				readTextFile( `./themes/${theme}/script.js` ).then( content => {
					try
					{
						eval( content );
					}
					catch ( error ) { console.error( error ); }
				} ).finally( next );
			};

			readTextFile( `./themes/${theme}/config.json` ).then( content => {
				try
				{
					Object.assign( options, JSON.parse( content ) );
				}
				catch ( error ) { console.error( error ); }
			} ).finally( loadScript );
		}
		else
			next();
	} ).catch( error => {
		console.error( error );
		document.body.innerText = 'The configuration file is missing !';
	} );
}

// Updates the elements with the "file-target" attribute (which corresponds to the text file to read)
function updateOverlay( init )
{
	if ( options.with_server )
	{
		if ( init )
			socketConnect();

		return ;
	}

	for ( let name of sort )
	{
		let file = getFileObject( name );
		if ( file )
			readTextFile( `../${name}.txt` ).then( content => updateElement( file, content, init ) );
	}
}

// Updates the item if the content has changed
function updateElement( file, content, init )
{
	content = content.trim();
	if ( !content )
		content = ( ( typeof( file.default ) !== 'undefined' && file.default != null ) ? file.default : '' );

	if ( typeof( file.value ) === 'undefined' || content != file.value )
	{
		let unchange = false;
		if ( typeof( file.update ) !== 'undefined' && file.update )
			unchange = file.update( file, content, init );
		else if ( content === '' )
			file.elem.innerHTML = '&nbsp;';
		else
			file.elem.innerText = content;

		if ( !unchange )
		{
			if ( !isNaN( parseFloat( content ) ) )
			{
				let value = parseFloat( content );
				file.elem.setAttribute( 'sign', ( value ? ( ( value > 0 ) ? 'plus' : 'minus' ) : 'default' ) );
			}

			file.value = content;

			// Performs a theme function, specifying that items were updated
			if ( typeof( window[ 'themeUpdate' ] ) === 'function' )
				window[ 'themeUpdate' ]( file.name, content );
		}
	}
}

initOverlay();
