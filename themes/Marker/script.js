//delay = 5000;
mmrwchange = true;
//occasionnal = 'Occasional';

// The elements to create while respecting the order
sort = [
	'RocketStats_MMR',
	'RocketStats_Streak'
];

if ( getOption( 'display_rank' ) )
	sort.unshift( 'RocketStats_Rank' );

if ( getOption( 'display_mmrchange' ) )
	sort.push( 'RocketStats_MMRChange' );

if ( getOption( 'display_streak' ) )
	sort = sort.concat( [ 'Streak_Plus', 'Streak_Minus', 'Streak_Default' ] )

// Adding static or loaded elements from text files to the overlay
files[ 'Streak_Plus' ] = { static: true, type: 'div' };
files[ 'Streak_Minus' ] = { static: true, type: 'div' };
files[ 'Streak_Default' ] = { static: true, type: 'div' };

// Function called by the overlay after the elements have been created
window[ 'themeUpdate' ] = ( name, content ) => {
	if ( name == 'RocketStats_Streak' )
	{
		let elem = document.querySelector( '[file-static="Streak_Default"]' );
		if ( elem )
		{
			let elem_plus = document.querySelector( '[file-static="Streak_Plus"]' );
			let elem_minus = document.querySelector( '[file-static="Streak_Minus"]' );

			let max = parseInt( window.getComputedStyle( elem, null ).getPropertyValue( 'width' ).replace( 'px', '' ) );
			let left = 143; // elem.offsetLeft

			let plus = ( ( ( content.length && content[ 0 ] == '+' ) ? Math.min( 6, parseInt( content.substr( 1 ) ) ) : 0 ) / 6 * max );
			let minus = ( ( ( content.length && content[ 0 ] == '-' ) ? Math.min( 6, parseInt( content.substr( 1 ) ) ) : 0 ) / 6 * max );

			elem.style = `margin: initial !important; left: ${left}px;`;
			elem_plus.style = `margin: initial !important; left: ${left}px; width: calc( ${plus}px ) !important`;
			elem_minus.style = `margin: initial !important; left: ${left}px; width: calc( ${minus}px ) !important`;
		}
	}
};
