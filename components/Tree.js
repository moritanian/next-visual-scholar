import React from 'react';
//import indexStyles from '../pages/index.scss'
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
        
        return { initTreeData: ret}, isServer;
        //return { initialState: store.getState(), isServer };
    }

    constructor(props){
        super(props)
        this.createTree = this.createTree.bind(this)
        this.treeRoot = null;
        this.treeEnd = null;
    }

    componentDidMount() {
        window.tree = this;
        this.updateTreeObj();

    }
    componentDidUpdate() {
        this.updateTreeObj();
    }

    updateTreeObj(){
        
        var posts = this.props.posts;

        if( posts === null || posts.length == 0 ){

            return false;
        
        }

        if( this.treeEnd && (this.treeEnd.children || this.treeEnd._children)){

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

    currentId(){

      if( this.props.currentArticle && this.props.currentArticle.articleData ){

        return this.props.currentArticle.articleData.cluster_id;

      }

      return null;

    }

    createTree() {
        var node = this.node;
        var margin = {top: 20, right: 120, bottom: 20, left: 320},
            width = 2000 - margin.right - margin.left,
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
        
        // Compute the new tree layout.
        var nodes = this.tree.nodes( this.root ).reverse(),
          links = this.tree.links(nodes);
        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 280; });
        // Update the nodes…
        var node = this.svg.selectAll("g.node")
          .data(nodes, (d) => { return d.id || (d.id = ++this.id); });
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", (d)=> { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", this.click.bind(this))
          .on("mouseover", this.mouseOver.bind(this))
          .on("mouseout", this.mouseOut.bind(this))
          .on("dblclick", this.dblClick.bind(this));

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", (d) => {
            if( this.currentId() == d.cluster_id){
              return '#f00'
            }
            return d._children ? "lightsteelblue" : "#fff"; 
          });
        nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .attr("title", function(d) { return d.url })
          .text(function(d) { 
            return d.title; 
          })
          .style("fill-opacity", 1e-6);
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", (d) => { 
            return "translate(" + d.y + "," + (d.x) + ")"; 
          });

        nodeUpdate.select('text')  
          .attr("x", function(d) {
           return d.children  ? -10 : 10; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children ? "end" : "start"; });

        nodeUpdate.select("circle")
          .attr("r", (d)=>{ return Math.log( Math.max( d.num_citations * d.num_citations, 2.0) ) + 1.0 } )
          .style("fill", (d) => {
            if( this.props.currentArticle && this.currentId() === d.cluster_id){
              return '#f00'
            }
            return d._children ? "lightsteelblue" : "#fff"; 
          });
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
        var link = this.svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", (d)=> {
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
          .attr("d", (d)=> {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();
        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
        
    // Toggle children on click.
    click(d) {

        this.props.onClickArticle( d );

        if (d.children) {
          
          d._children = d.children;
          d.children = null;
        
        } else if( d._children && d._children.length > 0) {
            
          d.children = d._children;
          d._children = null;
          

        } else {
        
          getPosts()(this.props.dispatch, d.cluster_id) 

          this.treeEnd = d; 
          return;
        }    

        this.update(d);
    }

    dblClick(d, i){
        if( d.url ){
            window.open( d.url );
        }
    }

    mouseOver(d, i){
    
    }

    mouseOut(d, i){

    }

    render() {
        return (
        <div>
             {/* <style jsx global >{indexStyles}</style> */}
        <style jsx global>{`


		.node {
		  cursor: pointer;
		}

		.node circle {
		  fill: #fff;
		  stroke: steelblue;
		  stroke-width: 1.5px;
		}

		.node text {
		  font: 10px sans-serif;
		}

		.link {
		  fill: none;
		  stroke: #ccc;
		  stroke-width: 1.5px;
		}
	`}</style>    
      <svg ref={node => this.node = node}>
      </svg>
    </div>
  );}
}

function mapStateToProps({ state}) {
  return { state };
}

//export default Tree;
export default connect(mapStateToProps)(Tree);
