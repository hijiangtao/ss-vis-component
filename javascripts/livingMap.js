/**
 * Created by Joe on 9/2/15.
 */

var demo = new Vue({
    el: 'body',
    data: {
        positions: null,
        judChange: 0
    },
    methods: {
        displayLiving: function ( ) {
            var self = this;

            if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

            var SCREEN_WIDTH = window.innerWidth;
            var SCREEN_HEIGHT = window.innerHeight;

            var container,stats, pointLight;

            var camera, scene, controls, renderer;

            //var judChange = 0;

            init();
            animate();

            function init() {

                container = document.getElementById('livingmap');


                //document.body.appendChild( container );

                //$('div').attr('id', 'three-canvas');

                renderer = new THREE.WebGLRenderer( { antialias: true } );

                //

                camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 25000 );
                camera.position.z = 3500;
                camera.position.y = -2500;
                //camera.rotation.z = Math.PI / 4;

                scene = new THREE.Scene();

                scene.fog = new THREE.Fog( 0x000000, 0.0008, 25000 );

                scene.add( new THREE.AmbientLight( 0xffffff ) );

                pointLight = new THREE.PointLight( 0x777777, 10, 1400 );
//            pointLight.position.set( 0, 40, 40 );
                scene.add( pointLight );

                // GROUND

                var maxAnisotropy = renderer.getMaxAnisotropy();

                var texture = THREE.ImageUtils.loadTexture( "img/TextureMap.png" );
                var pTexture = THREE.ImageUtils.loadTexture( "img/flag.png" );

                var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );

                texture.anisotropy = maxAnisotropy;
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//            texture.repeat.set( 512, 512 );

                var groundGeo = new THREE.PlaneBufferGeometry( 200, 100 );

                //0907
                var mesh = new THREE.Mesh( groundGeo, material );
                //mesh.rotation.x = - Math.PI / 4;
                mesh.rotation.z = 0;
                mesh.scale.set( 25, 25, 25 );

                //Particles

                var particles = 20;

                var geometry = new THREE.BufferGeometry();

                self.positions = new Float32Array( particles * 3 );
                var colors = new Float32Array( particles * 3 );


                var color = new THREE.Color();

                var n = 200, n2 = n / 2; // particles spread in the cube

                for ( var i = 0; i < self.positions.length; i += 3 ) {

                    // self.positions

                    var x = Math.random() * n - n2;
                    var y = (Math.random() * n - n2) / 2;
                    var z = 1.6;

                    self.positions[ i ]     = x;
                    self.positions[ i + 1 ] = y;
                    self.positions[ i + 2 ] = z;

                    // colors

                    var vx = ( x / n ) + 0.5;
                    var vy = ( y * 2 / n ) + 0.5;
                    var vz = 0.5;

                    color.setRGB( vx, vy, vz );

                    colors[ i ]     = color.r;
                    colors[ i + 1 ] = color.g;
                    colors[ i + 2 ] = color.b;

                    //line setting

//                var lGeo = new THREE.BufferGeometry();
//                var lMate = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, linewidth: 0.2 });
//                var lPos = new Float32Array( 6 );
//                var lColo = new Float32Array( 6 );
//
//                var j = 0;
//                lPos[ j ]     = x;
//                lPos[ j + 1 ] = y;
//                lPos[ j + 2 ] = z;
//                lPos[ j + 3 ] = x;
//                lPos[ j + 4 ] = y;
//                lPos[ j + 5 ] = 0;
//
//                lColo[ j ]     = color.r;
//                lColo[ j + 1 ] = color.g;
//                lColo[ j + 2 ] = color.b;
//                lColo[ j + 3 ] = color.r;
//                lColo[ j + 4 ] = color.g;
//                lColo[ j + 5 ] = color.b;
//
//                //lines drawing
//
//                lGeo.addAttribute( 'position', new THREE.BufferAttribute( lPos, 3 ) );
//                lGeo.addAttribute( 'color', new THREE.BufferAttribute( lColo, 3 ) );
//
//                lGeo.computeBoundingSphere();
//
//                var lMesh = new THREE.Line( lGeo, lMate );
//                lMesh.rotation.x = - Math.PI / 4;
//                lMesh.scale.set( 25, 25, 25 );

//                scene.add( lMesh ); 

                }

                //particles

                geometry.addAttribute( 'position', new THREE.BufferAttribute( self.positions, 3 ) );
                geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

                geometry.computeBoundingSphere();

                //

//            var pMate = new THREE.PointCloudMaterial( { size: 200, map: pTexture, vertexColors: THREE.VertexColors, blending: THREE.Additive, depthTest: false, transparent : true  } );
                var pMate = new THREE.PointCloudMaterial( { size: 200, map: pTexture, blending: THREE.AdditiveAlpha, depthTest: false, transparent : true  } );

                particleSystem = new THREE.PointCloud( geometry, pMate );

                //0907
                particleSystem.position.set( 1800, -500, 0);
                particleSystem.scale.set( 5, 5, 5 );
                //particleSystem.rotation.x = - Math.PI / 4;

                particleSystem2 = new THREE.PointCloud( geometry, pMate );
                particleSystem3 = new THREE.PointCloud( geometry, pMate );

                particleSystem2.position.set( -1800, 500, 0);
                particleSystem2.scale.set( 5, 5, 5 );
                particleSystem2.rotation.z = Math.PI / 4;
                //particleSystem2.rotation.x = - Math.PI / 4;
                particleSystem3.position.set( 500, -600, 0);
                particleSystem3.scale.set( 5, 5, 5 );
                particleSystem3.rotation.z = - Math.PI / 3;

                scene.add( particleSystem2 );
                scene.add( particleSystem3 );

                //0907 END

                scene.add( particleSystem );

                //console.log(particleSystem.geometry);

                scene.add( mesh );

                object = new THREE.AxisHelper( 1000 );
                object.position.set( 1000, 0, 0 );
                //scene.add( object );

                //controls

                controls = new THREE.TrackballControls( camera, container );

                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;

                controls.noZoom = false;
                controls.noPan = false;

                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                controls.keys = [ 65, 83, 68 ];

                controls.addEventListener( 'change', render );

                // RENDERER

                renderer.setClearColor( scene.fog.color );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
                renderer.autoClear = false;

                renderer.domElement.style.position = "relative";
                container.appendChild( renderer.domElement );

                // STATS1

                stats = new Stats();

                // align top-left
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = '0px';
                stats.domElement.style.top = '0px';

                document.body.appendChild( stats.domElement );
            }


            function animate() {
                requestAnimationFrame( animate );

                self.judChange++;

                if (self.judChange == 10) {
                    //update the living map people position data
                    self.livingUpdate();
                    self.judChange = 0;
                }

                particleSystem.geometry.attributes.position.needsUpdate = true;

                controls.update();

                render();
                stats.update();

            }

            function render() {

                renderer.enableScissorTest( false );
                renderer.clear();
                renderer.enableScissorTest( true );

                renderer.setScissor( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
                pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);

                renderer.render( scene, camera );
            }
        },
        livingUpdate: function () {
            var self = this;

            for ( var i = 0; i < self.positions.length; i += 3 ) {

                // self.positions

                var x = (Math.random() - 0.5) * 2;
                var y = (Math.random() - 0.5);
                var z = 1.6;

                self.positions[ i ]     += x;
                self.positions[ i + 1 ] += y;
                self.positions[ i + 2 ]  = z;

                if ( self.positions[ i ] < -100 )
                    self.positions[ i ] += 10;
                else if ( self.positions[ i ] > 100 )
                    self.positions[ i ] -= 10;

                if ( self.positions[ i + 1 ] < -50 )
                    self.positions[ i + 1 ] += 10;
                else if ( self.positions[ i + 1 ] > 50 )
                    self.positions[ i + 1 ] -= 10;
            }

        }
    },
    compiled: function () {
        var self = this;

        self.displayLiving();
    }
});