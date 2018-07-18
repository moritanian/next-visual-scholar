import React from 'react';
import indexStyles from '../pages/index.scss'
import { getPosts }  from '../actions/GetAction';
import { connect } from 'react-redux';
import configureStore from '../store/configureStore';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import * as d3 from 'd3';

//https://gist.github.com/mbostock/4339083
class Tree extends React.Component {
    
    static getInitialProps({ req }) {
        const isServer = !!req;
        const store = configureStore(applyMiddleware(thunk, logger), isServer);
        
        //const ret = await getPosts()( this.props.dispatch); 
        
        console.log(ret);
        console.log('getInitialProps tree')
       
        return { initTreeData: ret};
        //return { initialState: store.getState(), isServer };
    }

    constructor(props){
        super(props)
        this.createTree = this.createTree.bind(this)
        console.log('tree constructor');
        console.log(props);
        this.treeRoot = null;
        this.treeEnd = null;
    }

    componentDidMount() {
        console.log('tree did mout');
        window.tree = this;
    }
    componentDidUpdate() {
        console.log('tree did update');
        this.updateTreeObj();

    }

    updateTreeObj(){
        
        var posts = this.props.posts;
    
        if( posts === null || posts.length == 0){
            return false;
        }
        
        if( !this.treeRoot){
            
            this.treeRoot = {};

            this.treeRoot.children = [];

            appendTreeData( this.treeRoot, posts[0], 'cited');

            this.treeEnd = this.treeRoot.children[0];
        
            appendTreeDataList( this.treeEnd, posts);
            
            this.createTree();
            
            return false;
        }

        appendTreeDataList( this.treeEnd, posts);

        this.update( this.treeEnd);

        function appendTreeDataList( treeEnd, children, target) {
            
            if( !treeEnd.children ){
            
                treeEnd.children = [];
            
            }
            var i = 0;    
            children.forEach(  ( child )=> {
                //if(i> 1)
                  //  return;
                appendTreeData( treeEnd , child, target );
                i++;

            });

        }

        function appendTreeData( treeEnd, child, target){
            
            treeEnd.children.push( getTreeData( child, target )  );

        }

        function getTreeData( child, target='citing'){
            
            return child[target];

        }

        return true;
    }

    createTree() {
        var node = this.node;
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960 - margin.right - margin.left,
            height = 800 - margin.top - margin.bottom;
        this.tree = d3.layout.tree()
            .size([height, width]);



        this.svg = d3.select(node)//.append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

        this.root =  this.treeRoot.children[0];
        this.root.x0 = height / 2;
        this.root.y0 = 0;

        function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
        }

        this.id = 0;

        this.root.children.forEach(collapse);
        this.update( this.root);

    }
   
   update(source) {
        var duration = 750;
        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });
        
        const _self = this;
        var root = this.root
        var svg = this.svg;
        var tree = this.tree;

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);
          console.log(nodes)
        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });
        // Update the nodes…
        var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++_self.id); });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click)
          .on("mouseover", mouseOver)
          .on("mouseout", mouseOut)
          .on("dblclick", dblClick);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .attr("title", function(d) { return d.url })
          .text(function(d) { return d.title; })
          .style("fill-opacity", 1e-6);
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        nodeUpdate.select("circle")
          .attr("r", (d)=>{ return d.num_citations / 5.0} )
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeUpdate.select("text")
          .style("fill-opacity", 1);
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();
        nodeExit.select("circle")
          .attr("r", 1e-6);
        nodeExit.select("text")
          .style("fill-opacity", 1e-6);
        // Update the links…
        var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });
        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diagonal);
        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();
        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        
        // Toggle children on click.
        function click(d) {

          if (d.children) {
            
            d._children = d.children;
            d.children = null;
          
          } else if( d._children && d._children.length > 0) {
              
            d.children = d._children;
            d._children = null;
            

          } else {
          
            getPosts()(_self.props.dispatch, d.cluster_id) 

              _self.treeEnd = d; 
            return;
          }    

          _self.update(d);
        }

        function dblClick(d, i){
          console.log("dbclick");
          if( d.url )
            window.open( d.url );
        }

        function mouseOver(d, i){
        }

        function mouseOut(d, i){

        }
    }

    render() {
        return (
        <div>
             <style jsx global >{indexStyles}</style>
            <svg ref={node => this.node = node}>
            </svg>
        </div>
    );}
}

function mapStateToProps({ counter }) {
  return { counter };
}

//export default Tree;
export default connect(mapStateToProps)(Tree);
