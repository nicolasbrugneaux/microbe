(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 *
 * @return {void}
 */
var buildTest = function( _str1, _cb1, _str2, _cb2 )
{
    this.count = this.count || 0;

    var µTests  = µ( '#qunit-tests' ).children()[0];

    var resDiv  = µTests[ this.count ];

    var µLi      = µ( 'li', resDiv );
    var µStrong  = µ( 'strong', resDiv );
    var µResult =  µ( '<div.fastest>' );

    resDiv.insertBefore( µResult[ 0 ], µStrong[ 0 ] );

    if ( typeof _cb1 === 'function' )
    {
        var testRes = [];
        var _arr    = [];
        var i       = 0;
        var libraries = [ 'µ', '$' ];
        var suite = new Benchmark.Suite();

        suite.add( _str1, _cb1 )
            .add( _str2, _cb2 )
            .on( 'cycle', function( event )
            {
                _arr.push( this[ i ].hz );
                var test = testRes[ i ] = µ( '<span.speed--result.slow>' );
                µ( µLi[ i ] ).append( test );
                test.html( String( event.target ) );

                i++;
            } )
            .on( 'complete', function()
            {
                var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
                testRes[ fastest ].removeClass( 'slow' );

                µResult.html( libraries[ fastest ] + ' is the fastest' );
            } );

        var startTheTest = function( e )
        {
            e.stopPropagation();
            e.preventDefault();
            µResult.off();
            setTimeout( function()
            {
                suite.run( { 'async': true } );
            }, 1 );
        };

        µResult.html( 'Click to start the speed test' );
        µResult.on( 'click', startTheTest );
    }
    else
    {
        µResult.html( _str1 ).addClass( 'invalid--test' );
    }

    this.count++;
};

require( './init' )( buildTest );
require( './pseudo' )( buildTest );
require( './core' )( buildTest );
require( './root' )( buildTest );
require( './http' )( buildTest );
require( './dom' )( buildTest );
require( './events' )( buildTest );
require( './observe' )( buildTest );
},{"./core":2,"./dom":3,"./events":4,"./http":5,"./init":6,"./observe":7,"./pseudo":8,"./root":9}],2:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'core.js' );


    /**
     * µ addClass tests
     *
     * @test    addClass exists
     * @test    adds a class
     * @test    sets the data object
     * @test    sets multiple classes from an array
     * @test    multiple classes all set to data object
     * @test    multiple classes set by className string
     */
    QUnit.test( '.addClass()', function( assert )
    {
        assert.ok( µ().addClass, 'exists' );

        var µMooDivs        = µ( 'div' ).addClass( 'moo' );
        var µMooDivsLength  = µMooDivs.length;

        assert.equal( µMooDivsLength, µ( '.moo' ).length, 'it added a class!' );
        assert.ok( µMooDivs.get( 'class' )[0].indexOf( 'moo' ) !== -1, 'it set the class into the data object' );

        µ( '.moo' ).removeClass( 'moo' );

        µMooDivs = µ( 'div' ).first().addClass( [ 'moo', 'for--real' ] );
        assert.equal( µMooDivs.length, µ( '.moo.for--real' ).length, 'it added 2 classes from an array of strings' );

        var µDiv = µ( 'div' ).addClass( µMooDivs[0].className );
        assert.equal( µDiv.length, µ( '.moo.for--real' ).length, 'multiple classes set by className string' );

        var classData = µ( '.moo' )[0].data.class.class;

        assert.ok( classData.indexOf( 'for--real' ) !== -1, 'class sets data' );

        µ( '.moo' ).removeClass( 'moo  for--real' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
            {
                µDivs[ i ].className.replace( 'moo', '' );
            }
        };

        buildTest(
        'µDivs.addClass( \'moo\' )', function()
        {
            µDivs.addClass( 'moo' );

            resetDivs();
        },

        '$Divs.addClass( \'moo\' )', function()
        {
            $Divs.addClass( 'moo' );

            resetDivs();
        } );
    });


    /**
     * µ attr tests
     *
     * @test    attr exists
     * @test    sets an attr
     * @test    retrieves an attr
     * @test    removes an attr
     */
    QUnit.test( '.attr()', function( assert )
    {
        assert.ok( µ().attr, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.attr( 'testing', 'should work' );
        assert.equal( µTarget[0].getAttribute( 'testing' ), 'should work', 'attribute set' );

        var attrGotten = µTarget.attr( 'testing' );
        assert.equal( attrGotten[0], 'should work', 'attribute gotten' );

        µTarget.attr( 'testing', null );
        assert.equal( µTarget[0].getAttribute( 'testing' ), null, 'attribute removed' );

        µTarget.attr( { testing: 'tested', moon: 'doge' } );
        assert.equal( µTarget[0].getAttribute( 'moon' ), 'doge', 'attributes bulk added by object' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var vanillaRemove = function()
        {
            for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
            {
                µDivs[ i ].removeAttribute( 'moo' );
            }
        };

        buildTest(
        'µDivs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            µDivs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        },

        '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            $Divs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        } );
    });


    /**
     * µ children tests
     *
     * @test    children exists
     * @test    children returns an array
     * @test    full of microbes
     * @test    that are correct
     */
    QUnit.test( '.children()', function( assert )
    {
        assert.ok( µ().children, 'exists' );

        var children = µ( '.example--class' ).children();

        assert.ok( µ.isArray( children ), 'returns an array' );
        assert.ok( children[0].type === '[object Microbe]', 'full of microbes' );
        assert.deepEqual( µ( '.example--class' )[0].children[0], children[0][0], 'the correct children' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ css tests
     *
     * @test    css exists
     * @test    sets css
     * @test    retrieves a css array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     * @test    removes css
     */
    QUnit.test( '.css()', function( assert )
    {
        assert.ok( µ().css, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.css( 'background-color', 'rgb(255, 0, 0)' );
        assert.equal( µTarget[0].style.backgroundColor, 'rgb(255, 0, 0)', 'css set' );

        var cssGotten = µTarget.css( 'background-color' );
        assert.ok( µ.isArray( cssGotten ), 'css get returns an array' );
        assert.ok( typeof cssGotten[0] === 'string', 'full of strings' );
        assert.equal( cssGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( cssGotten[0], 'rgb(255, 0, 0)', 'correct result' );


        µTarget.css( 'background-color', null );
        assert.equal( µTarget[0].style.backgroundColor, '', 'css removed' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.css( \'background-color\', \'#f00\' )', function()
        {
            µTarget.css( 'background-color', '#f00' );
            µTarget.css( 'background-color', null );
        },

        '$Target.css( \'background-color\', \'#f00\' )', function()
        {
            $Target.css( 'background-color', '#f00' );
            $Target.css( 'background-color', null );
        } );
    });


    /**
     * µ each tests
     *
     * @test    each exists
     * @test    affects each element
     * @test    correctly
     */
    QUnit.test( '.each()', function( assert )
    {
        assert.ok( µ().each, 'exists' );

        var µDivs   = µ( 'div' );
        var divs    = [];

        µDivs.each( function( _el ){ divs.push( _el ); } );
        assert.equal( µDivs.length, divs.length, 'pushed each element' );
        assert.deepEqual( µDivs[ 0 ], divs[ 0 ], 'correct result' );

        µDivs       = µ( 'div' );
        var $Divs   = $( 'div' );

        buildTest(
        'µDivs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            µDivs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        },

        '$Divs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            $Divs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        } );
    });



    /**
     * µ extend tests
     *
     * @test    extend exists
     * @test    extends microbes
     * @test    extends objects
     */
    QUnit.test( '.extend()', function( assert )
    {
        assert.ok( µ().extend, 'exists' );
        assert.ok( µ.extend, 'exists' );

        var µDivs = µ( 'div' );
        var extension = { more: function(){ return 'MOAR!!!'; } };
        µDivs.extend( extension );
        assert.equal( µDivs.more(), 'MOAR!!!', 'extends microbes' );

        var _obj = { a: 1, b: 2, c:3 };
        µ.extend( _obj, extension );
        assert.equal( _obj.more(), 'MOAR!!!', 'extends objects' );


        buildTest(
        'µ.extend( _obj, extension );', function()
        {
            /* these are commented out to draw attention to how slow the
               other function is comparatively.  this one is quite a bit faster */
            // extension = { more: function(){ return 'MOAR!!!'; } };
            // _obj = µ( 'div' );
            // _obj.extend( extension );

            extension   = { more: function(){ return 'MOAR!!!'; } };
            _obj        = { a: 1, b: 2, c:3 };
            µ.extend( _obj, extension );
        },

        '$.extend( _obj, extension )', function()
        {
            /* these are commented out to draw attention to how slow the
               other function is comparatively.  this one is quite a bit faster */
            // extension   = { more: function(){ return 'MOAR!!!'; } };
            // _obj = $( 'div' );
            // _obj.extend( extension );

            extension   = { more: function(){ return 'MOAR!!!'; } };
            _obj        = { a: 1, b: 2, c:3 };
            $.extend( _obj, extension );
        } );
    });


    /**
     * µ filter tests
     *
     * @test    filter exists
     * @test    selects the correct elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.filter()', function( assert )
    {
        assert.ok( µ().filter, 'exists' );
        var µDivs   = µ( 'div' );
        var µId     = µDivs.filter( '#qunit' );

        assert.equal( µId.length, 1, 'selects the correct element' );

        µId         = µDivs.filter( ':lt(3)' );

        assert.equal( µId.length, 3, 'accepts pseudo selectors' );

        var $Divs;

        var resetDivs = function()
        {
            µDivs   = µ( 'div' );
            $Divs   = $( 'div' );
        };

        buildTest(
        'µDivs.filter( \'#qunit\' )', function()
        {
            resetDivs();
            µDivs.filter( '#qunit' );
        },

        '$Divs.filter( \'qunit\' )', function()
        {
            resetDivs();
            $Divs.filter( '#qunit' );
        } );
    });


    /**
     * µ find tests
     *
     * @test    find exists
     * @test    selects enough child elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.find()', function( assert )
    {
        assert.ok( µ().find, 'exists' );

        var µDiv    = µ( '#qunit' );
        var µH2     = µDiv.find( 'h2' );

        assert.equal( µH2.length, 2, 'selects enough child elements' );

            µH2     = µDiv.find( ':first' );

        assert.equal( µH2.length, 1, 'accepts pseudo selectors' );


        var µDivs, $Divs;

        var resetDivs = function()
        {
            µDivs   = µ( 'div' );
            $Divs   = $( 'div' );
        };

        buildTest(
        'µDivs.find( \'h2\' )', function()
        {
            resetDivs();
            µDivs.find( 'h2' );
        },

        '$Divs.find()', function()
        {
            resetDivs();
            $Divs.find( 'h2' );
        } );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the first one
     */
    QUnit.test( '.first()', function( assert )
    {
        assert.ok( µ().first, 'exists' );

        var µEverything = µ( '*' );
        var µFirst = µEverything.first();

        assert.equal( µFirst.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µFirst.length, 1, 'of length 1' );
        assert.deepEqual( µEverything[0], µFirst[0], 'that is actually the first one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.first()', function()
        {
            µDivs.first();
        },

        '$Divs.first()', function()
        {
            $Divs.first();
        } );
    });


    /**
     * µ getParentIndex tests
     *
     * @test    getParentIndex exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.getParentIndex()', function( assert )
    {
        assert.ok( µ().getParentIndex, 'exists' );

        var setup       = µ( '#example--combined' ).parent().children()[0];

        var literal     = setup[3];
        var _function   = setup[ µ( '#example--combined' ).getParentIndex()[0] ];

        assert.deepEqual( literal, _function, 'parent index is correctly determined' );


        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        buildTest(
        'µDiv.getParentIndex()', function()
        {
            µDiv.getParentIndex();
        },

        '$Div.index()', function()
        {
            var $DivParent  = $Div.parent();
            $DivParent.index( $Div );
        } );
    });


    /**
     * µ hasClass tests
     *
     * @test    hasClass exists
     * @test    checks every element
     * @test    correctly
     */
    QUnit.test( '.hasClass()', function( assert )
    {
        assert.ok( µ().hasClass, 'exists' );

        var µExampleClass = µ( '.example--class' );

        var exampleClass = µExampleClass.hasClass( 'example--class' );

        assert.ok( exampleClass.length === µExampleClass.length, 'it checks every element' );

        var correct = true;
        for ( var i = 0, lenI = exampleClass.length; i < lenI; i++ )
        {
            if ( ! exampleClass[ i ] )
            {
                correct = false;
                break;
            }
        }
        assert.ok( correct, 'correctly' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ html tests
     *
     * @test    html exists
     * @test    html sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
    QUnit.test( '.html()', function( assert )
    {
        assert.ok( µ().html, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.html( 'text, yo' );
        assert.equal( µTarget[0].innerHTML, 'text, yo', 'html set' );

        var htmlGotten = µTarget.html();
        assert.ok( µ.isArray( htmlGotten ), 'html() returns an array' );
        assert.ok( typeof htmlGotten[0] === 'string', 'full of strings' );

        assert.equal( htmlGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( htmlGotten[0], 'text, yo', 'correct result' );

        µTarget.html( '' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.html( \'blarg\' )', function()
        {
            µTarget.html( 'blarg' );
            µTarget.html();
        },

        '$Target.html( \'blarg\' )', function()
        {
            $Target.html( 'blarg' );
            $Target.html();
        } );
    });


    /**
     * µ indexOf tests
     *
     * @test    indexOf exists
     * @test    indexOf correctly determines the index
     */
    QUnit.test( '.indexOf()', function( assert )
    {
        assert.ok( µ().indexOf, 'exists' );

        var µTarget = µ( '#example--id' );

        var target  = document.getElementById( 'example--id' );
        var index   = µTarget.indexOf( target );

        assert.deepEqual( µTarget[ index ], target, 'index correctly determined' );

        var µDivs   = µ( 'div' );
        var $Divs   = $( 'div' );
        var _el     = document.getElementById( 'QUnit' );

        buildTest(
        'µDivs.indexOf( _el )', function()
        {
            µDivs.indexOf( _el );
        },

        '$Divs.index( _el )', function()
        {
            $Divs.index( _el );
        } );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the last one
     */
    QUnit.test( '.last()', function( assert )
    {
        assert.ok( µ().last, 'exists' );

        var µEverything = µ( '*' );
        var µLast = µEverything.last();

        assert.equal( µLast.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µLast.length, 1, 'of length 1' );
        assert.deepEqual( µLast[0], µEverything[ µEverything.length - 1 ], 'that is actually the last one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.last()', function()
        {
            µDivs.last();
        },

        '$Divs.last()', function()
        {
            $Divs.last();
        } );
    });


    /*
     * µ length test
     *
     * @test    length exists
     */
    QUnit.test( '.length', function( assert )
    {
        assert.equal( µ().length, 0, 'length initializes' );
        assert.equal( µ( 'head' ).length, 1, 'length reports correctly' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ map tests
     *
     * @test    map exists
     * @test    applies to all elements
     */
    QUnit.test( '.map()', function( assert )
    {
        assert.ok( µ().map, 'exists' );

        var µDivs = µ( 'div' );

        µDivs.map( function( el )
        {
            el.moo = 'moo';
        } );

        var rand = Math.floor( Math.random() * µDivs.length );

        assert.equal( µDivs[ rand ].moo, 'moo', 'applies to all elements' );


            µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );
        };


        buildTest(
        'µDivs.last( function(){} )', function()
        {
            resetDivs();

            µDivs.map( function( el )
            {
                el.moo = 'moo';
            } );
        },

        '$Divs.map( function(){} )', function()
        {
            resetDivs();

            $Divs.map( function( el )
            {
                el.moo = 'moo';
            } );
        } );
    });


    /**
     * µ merge tests
     *
     * @test    µ().merge exists
     * @test    µ.merge exists
     * @test    merged microbes
     * @test    merged arrays
     * @test    merged this
     */
    QUnit.test( '.merge()', function( assert )
    {
        assert.ok( µ().merge, 'µ().merge exists' );
        assert.ok( µ.merge, 'µ.merge exists' );

        var µDivs       = µ( 'div' );
        var divCount    = µDivs.length;
        var µHtml       = µ( 'html' );
        var htmlCount   = µHtml.length;

        var merged      = µ.merge( µDivs, µHtml );
        assert.equal( divCount + htmlCount, merged.length, 'merged microbes' );

        merged = µ.merge( [ 1, 2, 3 ], [ 4, 5, 6 ] );
        assert.equal( 6, merged.length, 'merged arrays' );

        µDivs       = µ( 'div' );
        µDivs.merge( µHtml );
        assert.equal( µDivs.length, divCount + htmlCount, 'merged this' );


        var $Divs, µLi, $Li;

        var refreshObjects = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );

            µLi = µ( 'li' );
            $Li = $( 'li' );
        };


        buildTest(
        'µ.merge( _obj, extension );', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // µDivs.merge( µLi );

            µ.merge( µDivs, µLi );
        },

        '$.merge( _obj, extension )', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // $Divs.merge( $Li );

            $.merge( $Divs, µLi );
        } );
    });


    /**
     * µ parent tests
     *
     * @test    parent exists
     * @test    returns a microbe
     * @test    of the correct length
     * @test    that is actually the parent(s)
     */
    QUnit.test( '.parent()', function( assert )
    {
        assert.ok( µ().parent, 'exists' );

        var µBody   = µ( 'body' );
        var µParent = µBody.parent();

        assert.equal( µParent.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µParent.length, 1, 'of the correct length' );
        assert.deepEqual( µParent[0], µ( 'html' )[0], 'that is actually the parent(s)' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.parent()', function()
        {
            µDivs.parent();
        },

        '$Divs.parent()', function()
        {
            $Divs.parent();
        } );
    });


    /**
     * µ push tests
     *
     * @test    push exists
     * @test    pushes to the microbe
     * @test    the correctc element
     */
    QUnit.test( '.push()', function( assert )
    {
        assert.ok( µ().push, 'exists' );

        var µDivs   = µ( 'div' );
        var µDivsLength = µDivs.length;
        var newDiv = µ( '<div>' )[0];

        µDivs.push( newDiv );

        assert.equal( µDivsLength + 1, µDivs.length, 'pushes to the microbe' );
        assert.deepEqual( newDiv, µDivs[ µDivs.length - 1 ], 'the correct element' );

        var _el;
        var µEmpty = µ( [] );
        var $Empty = $( [] );

        buildTest(
        'µEmpty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            µEmpty.push( _el );
        },

        '$Empty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            $Empty.push( _el );
        } );
    });


    /**
     * µ removeClass tests
     *
     * @test    removeClass exists
     * @test    sets data
     * @test    removes class in all elements
     */
    QUnit.test( '.removeClass()', function( assert )
    {
        assert.ok( µ().removeClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );
        µDivs.removeClass( 'example--class--groups' );

        var classData = µDivs[0].data.class.class;
        assert.ok( classData.indexOf( 'example--class--groups' ) === -1, 'removeClass sets data' );

        assert.equal( µ( '.example--class--groups' ).length, 0, 'removed class to both divs' );

        µ( '#qunit' ).addClass( 'test--yyy  test--zzz' );
        µ( '#qunit' ).removeClass( µ( '#qunit' )[0].className );
        assert.equal( 0, µ( '.test--yyy.test--zzz' ).length, 'multiple classes removed by className string' );

        µDivs.addClass( 'example--class--groups' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        var resetDivs = function()
        {
          for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
          {
              µDivs[ i ].className += ' moo';
          }
        };

        buildTest(
        'µDivs.removeClass( \'moo\' )', function()
        {
          µDivs.removeClass( 'moo' );

          resetDivs();
        },

        '$Divs.removeClass( \'moo\' )', function()
        {
          $Divs.removeClass( 'moo' );

          resetDivs();
        } );
    });


    /**
     * µ selector tests
     *
     * @test    selector exists
     * @test    correctly parses classes
     * @test    correctly parses ids
     * @test    correctly parses combined
     */
    QUnit.test( '.selector()', function( assert )
    {
        assert.ok( µ().selector, 'exists' );

        var _el = µ( '.example--class--groups' )[0];
        assert.equal( µ( _el ).selector(), 'div.example--class.example--class--groups', 'correctly parses classes' );

        _el = µ( '#microbe--example--dom' )[0];
        assert.equal( µ( _el ).selector(), 'div#microbe--example--dom', 'correctly parses ids' );

        _el = µ( '#example--combined' )[0];
        assert.equal( µ( _el ).selector(), 'div#example--combined.example--combined', 'correctly parses combined' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ splice tests
     *
     * @test    splice exists
     * @test    is the correct length
     */
    QUnit.test( '.splice()', function( assert )
    {
        assert.ok( µ().splice, 'exists' );
        assert.equal( µ( 'div' ).splice( 0, 5 ).length, 5, 'is the correct length' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.splice( 0, 5 )', function()
        {
            µDiv.splice( 0, 5 );
        },

        'µDiv.splice( 0, 5 )', function()
        {
            $Div.splice( 0, 5 );
        } );
    });


    /**
     * µ text tests
     *
     * @test    text exists
     * @test    text sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
    QUnit.test( '.text()', function( assert )
    {
        assert.ok( µ().text, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.text( 'text, yo' );

        var _text;
        if( document.all )
        {
            _text = µTarget[0].innerText;
        }
        else // FF
        {
            _text = µTarget[0].textContent;
        }


        assert.equal( _text, 'text, yo', 'text set' );

        var textGotten = µTarget.text();
        assert.ok( µ.isArray( textGotten ), 'text() get returns an array' );
        assert.ok( typeof textGotten[0] === 'string', 'full of strings' );

        assert.equal( textGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( textGotten[0], 'text, yo', 'correct result' );

        µTarget.text( '' );

        µTarget     = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.text( \'blarg\' )', function()
        {
            µTarget.text( 'blarg' );
            µTarget.text();
        },

        '$Target.text( \'blarg\' )', function()
        {
            $Target.text( 'blarg' );
            $Target.text();
        } );
    });


    /**
     * µ toggleClass tests
     *
     * @test    toggleClass exists
     * @test    removes classes
     * @test    adds classes
     */
    QUnit.test( '.toggleClass()', function( assert )
    {
        assert.ok( µ().toggleClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], false, 'removes classes' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], true, 'adds classes' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        buildTest(
        'µDivs.toggleClass( \'moo\' )', function()
        {
            µDivs.toggleClass( 'moo' );
        },

        '$Divs.toggleClass( \'moo\' )', function()
        {
            $Divs.toggleClass( 'moo' );
        } );
    });


    /**
     * µ type test
     *
     * @test    type exists
     */
    QUnit.test( '.type', function( assert )
    {
        var type = '[object Microbe]';

        assert.equal( µ().type, type, 'type is ' + type );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ version test
     *
     * @test    version exists
     */
    QUnit.test( '.version', function( assert )
    {
        var version = '0.3.1';

        assert.equal( µ().version, version, 'version is ' + version );

        buildTest( 'No speed tests available.' );
    });
};


},{}],3:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'dom.js' );

    /**
     * µ ready tests
     *
     * @test    ready exists
     * @test    is run after the dom loads
     */
    QUnit.test( 'µ.ready()', function( assert )
    {
        assert.ok( µ.ready, 'exists' );

        var domReady    = assert.async();

        var loaded = function()
        {
            assert.equal( µ( 'h1' ).length, 1, 'is run after dom loads' );

            domReady();
        };

        µ.ready( loaded );


        buildTest( 'No speed tests available.' );
    });


    /**
     * µ append tests
     *
     * @test    append exists
     * @test    attached microbe
     * @test    attached element
     * @test    attached by creation string                 // future feature
     * @test    attached by array of microbes               // future feature
     * @test    attached by array of elements
     * @test    attached by array of creation strings       // future feature
     */
    QUnit.test( '.append()', function( assert )
    {
        assert.ok( µ().append, 'exists' );

        var µNewDiv = µ( '<div.a--new--div>' );
        var µTarget = µ( '#example--id' );

        µTarget.append( µNewDiv );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
        µNewDiv.remove();

        µTarget.append( µNewDiv[0] );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
        µNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( '<div.a--new--div>' );
        // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
        // µ( '.a--new--div' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ µNewDiv, µAnotherNewDiv ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        µTarget.append( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ '<div.a--new--div>', '<div.a--new--div>' ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation strings' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();


        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.append( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.append( el );

            vanillaRemove( el );
        },

        '$Div.append( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.append( el );

            vanillaRemove( el );
        } );
    });


    /**
     * µ insertAfter tests
     *
     * @test    insertAfter exists
     * @test    add by creation string
     * @test    attached element
     * @test    add by microbe
     * @test    add by element
     */
    QUnit.test( '.insertAfter()', function( assert )
    {
        assert.ok( µ().insertAfter, 'exists' );

        var µTarget = µ( '#example--id' );
        var µTargetIndex = µTarget.getParentIndex()[0];

        var µTargetParent = µTarget.parent();
        var µTargetParentChildren = µTargetParent.children()[0].length;

        var _el = '<addedDivThing>';
        µTarget.insertAfter( _el );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by creation string' );
        µ( 'addedDivThing' ).remove();


        var µEl = µ( _el );
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by microbe' );
        µ( 'addedDivThing' ).remove();

        µEl = µ( '<addedDivThing>' )[0];
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by element' );
        µ( 'addedDivThing' ).remove();


        var siblingDiv      = document.getElementById( 'qunit' );
        var µSiblingDiv     = µ( siblingDiv );
        var $SiblingDiv     = $( siblingDiv );
        var parentDiv       = siblingDiv.parentNode;

        var vanillaCreate = function( i )
        {
            var el  = document.createElement( 'div' );
            el      = [ µ( el ), $( el ) ];

            return el[ i ];
        };

        var vanillaRemove = function( el )
        {
            parentDiv.removeChild( el[ 0 ] );
        };

        buildTest(
        'µDiv.insertAfter( el )', function()
        {
            var µEl = vanillaCreate( 0 );

            µSiblingDiv.insertAfter( µEl );

            vanillaRemove( µEl );
        },

        '$Div.insertAfter( el )', function()
        {
            var $El = vanillaCreate( 1 );

            $El.insertAfter( $SiblingDiv );

            vanillaRemove( $El );
        } );
    });


    /**
     * µ prepend tests
     *
     * @test    prepend exists
     * @test    attached microbe
     * @test    attached element
     * @test    attached by creation string                 // future feature
     * @test    attached by array of microbes               // future feature
     * @test    attached by array of elements
     * @test    attached by array of creation strings       // future feature
     */
    QUnit.test( '.prepend()', function( assert )
    {
        assert.ok( µ().prepend, 'exists' );

        var µNewDiv = µ( '<div.a--new--div>' );
        var µTarget = µ( '#example--id' );

        µTarget.prepend( µNewDiv );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
        µNewDiv.remove();

        µTarget.prepend( µNewDiv[0] );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
        µNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.prepend( '<div.a--new--div>' );
        // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
        // µ( '.a--new--div' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.prepend( [ µNewDiv, µAnotherNewDiv ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        µTarget.prepend( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.prepend( [ '<div.a--new--div>', '<div.a--new--div>' ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation strings' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();


        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.prepend( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.prepend( el );

            vanillaRemove( el );
        },

        '$Div.prepend( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.prepend( el );

            vanillaRemove( el );
        } );
    });


    /**
     * µ remove tests
     *
     * @test    remove exists
     * @test    element is removed
     */
    QUnit.test( '.remove()', function( assert )
    {
        assert.ok( µ().remove, 'exists' );

        var µFirstDiv   = µ( 'div' ).first();
        µFirstDiv.append( µ( '<divdiv.divide>' )[0] );

        µ( 'divdiv' ).remove();

        assert.equal( µ( 'divdiv' ).length, 0, 'element is removed' );

        var el, $El, µEl;
        var parentDiv   = µ( 'div' )[0];

        var vanillaAdd = function()
        {
            el = document.createElement( 'div' );
            µEl         = µ( el );
            $El         = $( el );

            parentDiv.appendChild( el );
            return el;
        };

        buildTest(
        'µDiv.remove()', function()
        {
            vanillaAdd();
            µEl.remove();
        },

        '$Div.remove()', function()
        {
            vanillaAdd();
            $El.remove();
        } );
    });
};

},{}],4:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'events.js' );

    /**
     * µ emit tests
     *
     * @test    emit exists
     * @test    custom event emitted
     * @test    custom event bubbled
     */
    QUnit.test( '.emit()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().emit, 'exists' );
        var µExamples   = µ( '.example--class' );
        var µParent     = µExamples.parent();

        var emitTest    = assert.async();
        var bubbleTest  = µ.once( assert.async() );

        µExamples.on( 'emitTest', function( e )
        {
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'custom event emitted' );
            emitTest();
        });


        µParent.on( 'bubbleTest', function( e )
        {
            assert.equal( e.detail.bubbled, 'true', 'custom event bubbled' );
            µParent.off();
            bubbleTest();
        });


        µExamples.emit( 'emitTest', { doIt: '2 times' } );
        µParent.emit( 'bubbleTest', { bubbled: 'true' }, true );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        buildTest(
        'µDiv.emit( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            µDiv.emit( 'testClick', { wooo: 'i\'m a ghost!'} );
        },

        '$Div.trigger( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            $Div.trigger( 'testClick', { wooo: 'i\'m a ghost!'} );
        } );
    });


    /**
     * µ on tests
     *
     * @test    on exists
     * @test    sets unload data
     * @test    event correctly listened to
     */
    QUnit.test( '.on()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().on, 'exists' );

        var µExamples   = µ( '.example--class' );

        var onTest      = assert.async();

        µExamples.on( 'onTest', function( e )
        {
            var func = µExamples[0].data['_onTest-bound-function']['_onTest-bound-function'][0];

            assert.equal( typeof func, 'function', 'sets unload data' );
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'event correctly listened to' );
            onTest();
        });

        µExamples.emit( 'onTest', { doIt: '2 times' } );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaRemoveListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].removeEventListener( 'click', _func );
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).on( \'click\', function(){} )', function()
        {
            µDiv.on( 'click', _func );
            vanillaRemoveListener( µDiv );
        },

        '$( \'div\' ).on( \'click\', function(){} )', function()
        {
            $Div.on( 'click', _func );
            vanillaRemoveListener( $Div );
        } );
    });


    /**
     * µ off tests
     *
     * @test    off exists
     * @test    listener removed
     */
    QUnit.test( '.off()', function( assert )
    {
        assert.ok( µ().off, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples.on( 'turningOff', function( e ){});
        µExamples.off( 'turningOff' );
        var func = µExamples[0].data[ '_turningOff-bound-function' ][ '_turningOff-bound-function' ][0];

        assert.equal( func, null, 'listener removed' );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaAddListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].addEventListener( 'click', _func );
                divs[ i ].data = divs[ i ].data || {};
                divs[ i ].data[ '_click-bound-function' ] = divs[ i ].data[ '_click-bound-function' ] || {};
                divs[ i ].data[ '_click-bound-function' ][ '_click-bound-function' ] = _func;
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).on( \'click\', function(){} )', function()
        {
            vanillaAddListener( µDiv );
            µDiv.off( 'click' );
        },

        '$( \'div\' ).on( \'click\', function(){} )', function()
        {
            vanillaAddListener( $Div );
            $Div.off( 'click' );
        } );
    });
};

},{}],5:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'http.js' );


    /**
     * µ http tests
     *
     * @test    http exists
     * @test    page correctly retrieved
     * @test    parameters are recieved correctly
     * @test    errors are handled correctly
     */
    QUnit.test( '.http', function( assert )
    {
        assert.ok( µ.http, 'exists' );

        var getTest      = assert.async();
        µ.http( { url: './httpTest.html', method: 'GET' } ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );

        var parameterTest      = assert.async();
        µ.http( {
                    url         : './httpTest.html',
                    method      : 'GET',
                    headers     : {
                        Accept      : 'text/plain'
                    },
                    async       : true
                }
        ).then( function( data )
        {
            assert.equal( data, 'moon', 'parameters are recieved correctly' );
            parameterTest();
        } );

        var errorTest      = assert.async();
        µ.http( { url : './httpTest.hml' }
        ).catch( function( e )
        {
            assert.equal( e, 'Error: 404', 'errors are handled correctly' );
            errorTest();
        } );

        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.get tests
     *
     * @test    http.get exists
     * @test    page correctly retrieved
     */
    QUnit.test( '.http.get', function( assert )
    {
        assert.ok( µ.http.get, 'exists' );

        var getTest      = assert.async();

        µ.http.get( './httpTest.html' ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );


        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.post tests
     *
     * @test    http.post exists
     */
    QUnit.test( '.http.post', function( assert )
    {
        assert.ok( µ.http.post, 'exists' );


        buildTest( 'Speed depends on network traffic.' );
    });
};

},{}],6:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, buildTest  */
module.exports = function( buildTest )
{
    QUnit.module( 'init.js' );


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'wrap an element', function( assert )
    {
        var _body = document.getElementsByTagName( 'body' )[0];
        var µBody = µ( _body );

        assert.equal( µBody.length, 1, 'one body' );
        assert.deepEqual( µBody[ 0 ], _body, 'passes' );

        buildTest(
        'µ( _el )', function()
        {
            return µ( _body );
        },

        '$( _el )', function()
        {
            return $( _body );
        } );
    });


    /**
     * µ init query class tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query class', function( assert )
    {
        var _div = document.getElementsByClassName( 'example--class' )[0];
        var µDiv = µ( '.example--class' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'.example--class\' )', function()
        {
            return µ( '.example--class' );
        },

        '$( \'.example--class\' )', function()
        {
            return $( '.example--class' );
        } );
    });


    /**
     * µ init query id tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'query id', function( assert )
    {
        var _div = document.getElementById( 'example--id' );
        var µDiv = µ( '#example--id' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'#example--id\' )', function()
        {
            return µ( '#example--id' );
        },

        '$( \'#example--id\' )', function()
        {
            return $( '#example--id' );
        } );
    });


    /**
     * µ init query tagname tests
     *
     * @test    correct element
     * @test    passes
     */
    QUnit.test( 'query tagname', function( assert )
    {
        var _div = document.getElementsByTagName( 'div' )[0];
        var µDiv = µ( 'div' );

        assert.equal( µDiv[ 0 ].tagName, 'DIV', 'correct element' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div\' )', function()
        {
            return µ( 'div' );
        },

        '$( \'div\' )', function()
        {
            return $( 'div' );
        } );
    });


    /**
     * µ init query combined tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query combined', function( assert )
    {
        var _div = document.querySelector( 'div#example--combined.example--combined' );
        var µDiv = µ( 'div#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div#example--combined.example--combined\' )', function()
        {
            return µ( 'div#example--combined.example--combined' );
        },

        '$( \'div#example--combined.example--combined\' )', function()
        {
            return $( 'div#example--combined.example--combined' );
        } );
    });


    /**
     * µ init query with microbe scope tests
     *
     * @test    two divs
     * @test    correct element
     */
    QUnit.test( 'query with microbe scope', function( assert )
    {
        var µDiv = µ( 'div', µ( '.example--class--groups' ) );
        var $Div = $( 'div', $( '.example--class--groups' ) );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.equal( µDiv[0].tagName, 'DIV', 'correct element' );

        buildTest(
        'µ( \'div\', µDiv )', function()
        {
            return µ( 'div', µDiv );
        },

        '$( \'div\', $Div )', function()
        {
            return $( 'div', $Div );
        } );
    });


    /**
     * µ init query with element scope tests
     *
     * @test    two divs
     * @test    correct parent
     */
    QUnit.test( 'query with element scope', function( assert )
    {
        var _scopeEl = µ( '.example--class--groups' )[0];

        var µDiv = µ( 'div', _scopeEl );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.deepEqual( µDiv.first().parent()[0], _scopeEl, 'correct parent' );

        buildTest(
        'µ( \'div\', _scopeEl )', function()
        {
            return µ( 'div', _scopeEl );
        },

        '$( \'div\', _scopeEl )', function()
        {
            return $( 'div', _scopeEl );
        } );
    });


    /**
     * µ init query with string scope tests
     *
     * @test    correctly formed selector
     * @test    two divs
     */
    QUnit.test( 'query with string scope', function( assert )
    {
        var µDiv = µ( 'div', '.example--class--groups' );
        assert.equal( µDiv.selector(), '.example--class--groups div', 'correctly formed selector' );
        assert.equal( µDiv.length, 2, 'two divs' );


        buildTest(
        'µ( \'div\', \'.example--class--groups\' )', function()
        {
            return µ( 'div', '.example--class--groups' );
        },

        '$( \'div\', \'.example--class--groups\' )', function()
        {
            return $( 'div', '.example--class--groups' );
        } );
    });
};

},{}],7:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'observe.js' );


    /**
     * µ get tests
     *
     * @test    get exists
     * @test    get gets
     */
    QUnit.test( '.get', function( assert )
    {
        assert.ok( µ().get, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples[0].data = µExamples[0].data || {};
        µExamples[0].data.moo = µExamples[0].data.moo || {};
        µExamples[0].data.moo.moo = 'mooon!';

        assert.equal( µExamples.get( 'moo' )[0], 'mooon!', 'get gets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observe tests
     *
     * @test    observe exists
     * @test    observe function correctly stored
     * @test    object correctly observed
     */
    QUnit.test( '.observe()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().observe, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeTest = assert.async();

        µExamples.observe( 'observeTest', function( e )
        {
            assert.equal( typeof µExamples[0].data.observeTest._observeFunc, 'function', 'observe function stored' );
            µExamples.unobserve();
            assert.equal( e[0].object.observeTest, 'whoohoo', 'object correctly observed' );
            observeTest();
        });

        µExamples.set( 'observeTest', 'whoohoo' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observeOnce tests
     *
     * @test    observeOnce exists
     * @test    object correctly observed
     */
    QUnit.test( '.observeOnce', function( assert )
    {
        assert.expect( 2 );

        assert.ok( µ().observeOnce, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeOnceTest      = assert.async();

        µExamples.observeOnce( 'observeOnceTest', function( e )
        {
            assert.equal( e[0].object.observeOnceTest, 'whoohoo', 'object correctly observed' );

            observeOnceTest();
        });

        µExamples.set( 'observeOnceTest', 'whoohoo' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ set tests
     *
     * @test    set exists
     * @test    set sets
     */
    QUnit.test( '.set', function( assert )
    {
        assert.ok( µ().set, 'exists' );

        var µExamples   = µ( '.example--class' );
        µExamples.set( 'moo', 'mooon!' );

        var setData = µExamples[0].data.moo.moo;

        assert.equal( setData, 'mooon!', 'set sets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ unobserve tests
     *
     * @test    unobserve exists
     */
    QUnit.test( '.unobserve', function( assert )
    {
        assert.ok( µ().unobserve, 'exists' );

        buildTest( 'No comparison available.' );
    });
};

},{}],8:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'pseudo.js' );


    /**
     * µ contains tests
     *
     * @test    contains exists
     * @test    searches text
     * @test    ignores case
     * @test    ignores false returns
     */
    QUnit.test( ':contains(text)', function( assert )
    {
        assert.ok( µ.pseudo.contains, 'exists' );
        assert.equal( µ( '#example--combined:contains(I am)' ).length, 1, 'searches text' );
        assert.equal( µ( '#example--combined:contains(i am)' ).length, 1, 'ignores case' );
        assert.equal( µ( '#example--combined:contains(moon)' ).length, 0, 'ignores false returns' );

        buildTest(
        'µ( \'#example--combined:contains(I am)\' )', function()
        {
            return µ( '#example--combined:contains(I am)' );
        },

        '$( \'#example--combined:contains(I am)\' )', function()
        {
            return $( '#example--combined:contains(I am)' );
        } );
    });


    /**
     * µ even tests
     *
     * @test    even exists
     * @test    selects only the even scripts
     * @test    selects the correct half
     */
    QUnit.test( ':even', function( assert )
    {
        var µEvenScripts   = µ( 'script:even' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.even, 'exists' );
        assert.equal( µEvenScripts, Math.floor( µScripts / 2 ), 'selects only the even scripts' );
        assert.deepEqual( µScripts[1], µEvenScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:even\' )', function()
        {
            return µ( 'div:even' );
        },

        '$( \'div:even\' )', function()
        {
            return $( 'div:even' );
        } );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':first', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µFirstDiv   = µ( 'div:first' );

        assert.ok( µ.pseudo.first, 'exists' );
        assert.deepEqual( µDivs[ 0 ], µFirstDiv[ 0 ], 'finds the right div' );
        assert.equal( µFirstDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:first\' )', function()
        {
            return µ( 'div:first' );
        },

        '$( \'div:first\' )', function()
        {
            return $( 'div:first' );
        } );
    });


    /**
     * µ gt tests
     *
     * @test    gt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':gt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µGtDivs     = µ( 'div:gt(3)' );

        assert.ok( µ.pseudo.gt, 'exists' );
        assert.deepEqual( µDivs[ 6 ], µGtDivs[ 3 ], 'finds the right divs' );
        assert.equal( µGtDivs.length, µDivs.length - 3, 'finds the correct number of elements' );

        buildTest(
        'µ( \'div:gt(3)\' )', function()
        {
            return µ( 'div:gt(3)' );
        },

        '$( \'div:gt(3)\' )', function()
        {
            return $( 'div:gt(3)' );
        } );
    });


    /**
     * µ has tests
     *
     * @test    has exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':has(S)', function( assert )
    {
        var µHasDiv = µ( 'div:has(li)' );

        assert.ok( µ.pseudo.has, 'exists' );
        assert.equal( µHasDiv.length, 1, 'grabs the correct amount of elements' );

        buildTest(
        'µ( \'div:has(li)\' )', function()
        {
            return µ( 'div:has(li)' );
        },

        '$( \'div:has(li)\' )', function()
        {
            return $( 'div:has(li)' );
        } );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':last', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLastDiv    = µ( 'div:last' );

        assert.ok( µ.pseudo.last, 'exists' );
        assert.deepEqual( µDivs[ µDivs.length - 1 ], µLastDiv[ 0 ], 'finds the right div' );
        assert.equal( µLastDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:last\' )', function()
        {
            return µ( 'div:last' );
        },

        '$( \'div:last\' )', function()
        {
            return $( 'div:last' );
        } );
    });


    /**
     * µ lt tests
     *
     * @test    lt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':lt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLtDivs     = µ( 'div:lt(3)' );

        assert.ok( µ.pseudo.lt, 'exists' );
        assert.deepEqual( µDivs[ 1 ], µLtDivs[ 1 ], 'finds the right divs' );
        assert.equal( µLtDivs.length, 3, 'finds the correct number if elements' );

        buildTest(
        'µ( \'div:lt(2)\' )', function()
        {
            return µ( 'div:lt(2)' );
        },

        '$( \'div:lt(2)\' )', function()
        {
            return $( 'div:lt(2)' );
        } );
    });


    /**
     * µ odd tests
     *
     * @test    odd exists
     * @test    selects only the odd scripts
     * @test    selects the correct half
     */
    QUnit.test( ':odd', function( assert )
    {
        var µOddScripts    = µ( 'script:odd' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.odd, 'exists' );
        assert.equal( µOddScripts, Math.ceil( µScripts / 2 ), 'selects only the odd scripts' );
        assert.deepEqual( µScripts[0], µOddScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:odd\' )', function()
        {
            return µ( 'div:odd' );
        },

        '$( \'div:odd\' )', function()
        {
            return $( 'div:odd' );
        } );
    });


    /**
     * µ root tests
     *
     * @test    root exists
     * @test    selects the root
     */
    QUnit.test( ':root', function( assert )
    {
        var µRoot = µ( 'div:root' );

        assert.ok( µ.pseudo.root, 'exists' );
        assert.deepEqual( µRoot[ 0 ], µ( 'html' )[ 0 ], 'selects the root' );

        buildTest(
        'µ( \'div:root\' )', function()
        {
            return µ( 'div:root' );
        },

        '$( \'div:root\' )', function()
        {
            return $( 'div:root' );
        } );
    });


    /**
     * µ target tests
     *
     * @test    target exists
     * @test    finds the correct element
     * @test    and only that one
     */
    QUnit.test( ':target', function( assert )
    {
        window.location.hash = 'example--combined';
        var µTarget = µ( 'div:target' );
        var µIdSearch = µ( '#example--combined' );

        assert.ok( µ.pseudo.target, 'exists' );
        assert.deepEqual( µTarget[ 0 ], µIdSearch[ 0 ], 'finds the correct element' );
        assert.equal( µTarget.length, 1, 'and only that one' );

        buildTest(
        'µ( \'div:target\' )', function()
        {
            return µ( 'div:target' );
        },

        '$( \'div:target\' )', function()
        {
            return $( 'div:target' );
        } );

        window.location.hash = '';
    });
};


},{}],9:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'root.js' );


    /**
     * µ capitalize tests
     *
     * @test    capitalize exists
     * @test    capitalise exists
     * @test    capitalizes strings
     * @test    capitalizes string arrays
     */
    QUnit.test( '.capitalize()', function( assert )
    {
        assert.ok( µ.capitalize, 'exists' );
        assert.ok( µ.capitalise, 'exists' );
        assert.ok( µ.capitalise( 'i dont know' ) === 'I Dont Know', 'capitalizes strings' );

        var strArr = [ 'i dont know', 'for real' ];
            strArr = µ.capitalize( strArr );
        assert.ok( strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ debounce tests
     *
     * @test    debounce exists
     */
    QUnit.test( '.debounce()', function( assert )
    {
        assert.ok( µ.debounce, 'exists' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ identity tests
     *
     * @test    identity exists
     * @test    it equals itself
     */
    QUnit.test( '.identity()', function( assert )
    {
        assert.ok( µ.identity, 'exists' );
        var val = 'mooon';
        assert.equal( 'mooon', µ.identity( 'mooon' ), 'it equals itself' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ insertStyle tests
     *
     * @test    insertStyle exists
     */
    QUnit.test( '.insertStyle()', function( assert )
    {
        assert.ok( µ.insertStyle, 'exists' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ noop tests
     *
     * @test    noop exists
     * @test    nothing happens
     *
     * µ xyzzy tests
     *
     * @test    xyzzy exists
     * @test    nothing happens
     */
    QUnit.test( '.noop()', function( assert )
    {
        assert.ok( µ.noop, 'noop exists' );
        assert.equal( µ.noop(), undefined, 'nothing happens' );

        assert.ok( µ.xyzzy, 'xyzzy exists' );
        assert.equal( µ.xyzzy(), undefined, 'nothing happens' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ isArray tests
     *
     * @test    isArray exists
     * @test    true for array
     * @test    false otherwise
     */
    QUnit.test( '.isArray()', function( assert )
    {
        assert.ok( µ.isArray, 'exists' );
        assert.ok( µ.isArray( [ 1, 2, 3 ] ), 'true for array' );
        assert.ok( !µ.isArray( { 1: 'a', 2: 'b' } ), 'false otherwise' );

        buildTest(
        'µ.isArray', function()
        {
            µ.isArray( {} );
            µ.isArray( [ 1, 2, 3 ] );
        },

        '$.isArray', function()
        {
            $.isArray( {} );
            $.isArray( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isEmpty tests
     *
     * @test    isEmpty exists
     * @test    true for empty
     * @test    false otherwise
     */
    QUnit.test( '.isEmpty()', function( assert )
    {
        assert.ok( µ.isEmpty, 'exists' );
        assert.ok( µ.isEmpty( {} ), 'true on empty' );
        assert.ok( !µ.isEmpty( { a: 1 } ), 'false otherwise' );

        buildTest(
        'µ.isEmpty', function()
        {
            µ.isEmpty( {} );
            µ.isEmpty( { a: 2 } );
        },

        '$.isEmptyObject', function()
        {
            $.isEmptyObject( {} );
            $.isEmptyObject( { a: 2 } );
        } );
    });


    /**
     * µ isFunction tests
     *
     * @test    isFunction exists
     * @test    true for function
     * @test    false otherwise
     */
    QUnit.test( '.isFunction()', function( assert )
    {
        assert.ok( µ.isFunction, 'exists' );
        assert.ok( µ.isFunction( assert.ok ), 'true on function' );
        assert.ok( !µ.isFunction( {} ), 'false otherwise' );

        buildTest(
        'µ.isFunction', function()
        {
            µ.isFunction( function(){} );
            µ.isFunction( [ 1, 2, 3 ] );
        },

        '$.isFunction', function()
        {
            $.isFunction( function(){} );
            $.isFunction( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isObject tests
     *
     * @test    isObject exists
     * @test    true for objects
     * @test    false otherwise
     */
    QUnit.test( '.isObject()', function( assert )
    {
        assert.ok( µ.isObject, 'exists' );
        assert.ok( µ.isObject( {} ), 'true for objects' );
        assert.ok( !µ.isObject( 'ä' ), 'false otherwise' );

        buildTest(
        'µ.isObject', function()
        {
            µ.isObject( {} );
            µ.isObject( [ 1, 2, 3 ] );
        },

        '$.isPlainObject', function()
        {
            $.isPlainObject( {} );
            $.isPlainObject( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isUndefined tests
     *
     * @test    isUndefined exists
     * @test    false if parent contains property
     * @test    true otherwise
     */
    QUnit.test( '.isUndefined()', function( assert )
    {
        var parent = { a: 1 };
        assert.ok( µ.isUndefined, 'exists' );
        assert.ok( !µ.isUndefined( 'a', parent ), 'false if parent contains property' );
        assert.ok( µ.isUndefined( 'b', parent ), 'true otherwise' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ isWindow tests
     *
     * @test    isWindow exists
     * @test    true for window
     * @test    false otherwise
     */
    QUnit.test( '.isWindow()', function( assert )
    {
        assert.ok( µ.isWindow, 'exists' );
        assert.ok( µ.isWindow( window ), 'true for window' );
        assert.ok( !µ.isWindow( {} ), 'false otherwise' );

        buildTest(
        'µ.isWindow', function()
        {
            µ.isWindow( window );
            µ.isWindow( [ 1, 2, 3 ] );
        },

        '$.isWindow', function()
        {
            $.isWindow( window );
            $.isWindow( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ once tests
     *
     * @test    once exists
     */
    QUnit.test( '.once()', function( assert )
    {
        assert.ok( µ.once, 'exists' );
        var _f = µ.once( function(){ return 'moon'; } );
        assert.equal( _f(), 'moon', 'runs once' );
        assert.equal( _f(), undefined, 'and only once' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ poll tests
     *
     * @test    poll exists
     */
    QUnit.test( '.poll()', function( assert )
    {
        assert.expect( 3 );

        var _fail       = function(){ return false; };
        var _succees    = function(){ return true; };

        var failTest    = assert.async();

        assert.ok( µ.poll, 'exists' );

        µ.poll( _fail, _fail, function()
        {
            assert.ok( true, 'failure handled correctly' );
            failTest();
        }, 100, 25 );

        var successTest = assert.async();

        µ.poll( _succees, function()
        {
            assert.ok( true, 'success handled correctly' );
            successTest();
        }, _succees, 100, 25 );


        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyle tests
     *
     * @test    removeStyle exists
     */
    QUnit.test( '.removeStyle()', function( assert )
    {
        assert.ok( µ.removeStyle, 'exists' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyles tests
     *
     * @test    removeStyles exists
     */
    QUnit.test( '.removeStyles()', function( assert )
    {
        assert.ok( µ.removeStyles, 'exists' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ toString tests
     *
     * @test    µ().toString exists
     * @test    µ.toString exists
     * @test    microbe is [object Microbe]
     */
    QUnit.test( '.toString()', function( assert )
    {
        assert.ok( µ().toString, 'µ().toString exists' );
        assert.ok( µ.toString, 'exists on root' );
        assert.ok( µ().toString() === '[object Microbe]', 'microbe is [object Microbe]' );

        buildTest(
        'µ.toString', function()
        {
            µ.toString( µ );
            µ.toString( [ 1, 2, 3 ] );
        },

        '$.toString', function()
        {
            $.toString( $ );
            $.toString( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ toArray tests
     *
     * @test    µ().toArray exists
     * @test    µ.toArray exists
     * @test    makes arrays
     */
    QUnit.test( '.toArray()', function( assert )
    {
        assert.ok( µ().toArray, 'exists' );
        assert.ok( µ.toArray, 'exists' );

        var arr = µ( 'div' ).toArray();
        assert.equal( µ.type( arr ), 'array', 'makes arrays' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ type tests
     *
     * @test    µ.type exists
     * @test    checks arrays
     * @test    checks numbers
     * @test    checks objects
     * @test    checks strings
     * @test    checks dates
     * @test    checks microbes
     * @test    checks regex
     * @test    checks functions
     * @test    checks boolean primitives
     * @test    checks boolean objects
     * @test    checks error objects
     * @test    checks promises
     */
    QUnit.test( '.type()', function( assert )
    {
        assert.ok( µ.type, 'exists' );
        assert.equal( µ.type( [] ), 'array', 'checks arrays' );
        assert.equal( µ.type( 2 ), 'number', 'checks numbers' );
        assert.equal( µ.type( {} ), 'object', 'checks objects' );
        assert.equal( µ.type( 'moin!' ), 'string', 'checks strings' );
        assert.equal( µ.type( new Date() ), 'date', 'checks dates' );
        assert.equal( µ.type( µ( 'div' ) ), 'microbe', 'checks microbes' );
        assert.equal( µ.type( /[0-9]/ ), 'regExp', 'checks regex' );
        assert.equal( µ.type( assert.ok ), 'function', 'checks functions' );
        assert.equal( µ.type( true ), 'boolean', 'checks boolean primitives' );
        assert.equal( µ.type( new Boolean( true ) ), 'object', 'checks boolean objects' );
        assert.equal( µ.type( new Error() ), 'error', 'checks error objects' );
        assert.equal( µ.type( new Promise(function(){}) ), 'promise', 'checks promises' );

        buildTest(
        'µ.type', function()
        {
            µ.type( [] );
            µ.type( 2 );
            µ.type( {} );
            µ.type( 'moin!' );
            µ.type( new Date() );
            µ.type( µ( 'div' ) );
            µ.type( /[0-9]/ );
            µ.type( assert.ok );
            µ.type( true );
            µ.type( new Boolean( true ) );
            µ.type( new Error() );
            µ.type( new Promise(function(){}) );
        },

        '$.type', function()
        {
            $.type( [] );
            $.type( 2 );
            $.type( {} );
            $.type( 'moin!' );
            $.type( new Date() );
            $.type( $( 'div' ) );
            $.type( /[0-9]/ );
            $.type( assert.ok );
            $.type( true );
            $.type( new Boolean( true ) );
            $.type( new Error() );
            $.type( new Promise(function(){}) );
        } );
    });
};
},{}]},{},[1]);
