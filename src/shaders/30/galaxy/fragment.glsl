        varying vec3 vColor;
        
        void main(){
            //disc
            // float strenght =1.0- step(0.5,distance(gl_PointCoord, vec2(0.5)));

            //diffuse point pattern
            // float strenght = distance(gl_PointCoord, vec2(0.5));
            // strenght *=2.0;
            // strenght = 1.0 - strenght;

            //light point pattern
            float strenght =1.0- distance(gl_PointCoord, vec2(0.5));
            strenght = pow(strenght, 10.0);

            //final color
            vec3 color = mix(vec3(0.0), vColor, strenght);


            gl_FragColor= vec4(color,1.0);
            // gl_FragColor= vec4(vColor,strenght);//second easier way (don`t forget transparent: true in shader options)


            #include <colorspace_fragment>
        }