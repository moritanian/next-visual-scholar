import React from 'react';
import { connect } from 'react-redux';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
//import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class Form extends React.Component {

    displayData (){

    	if ( !this.props.article.articleData ){
    		return null;
    	}

    	return [ this.props.article.articleData ];

    }

	render() {
		
		return (
			<div>
			<h2>Result</h2>
			<BootstrapTable
				data={this.displayData()}>
				<TableHeaderColumn dataField="title" isKey dataAlign="right" dataSort>Title</TableHeaderColumn>
				<TableHeaderColumn dataField="url"  dataAlign="right" dataSort>URL</TableHeaderColumn>
				<TableHeaderColumn dataField="author"  dataAlign="right" dataSort>Author</TableHeaderColumn>
				<TableHeaderColumn dataField="excerpt"  dataAlign="right" dataSort>Excerpt</TableHeaderColumn>
			</BootstrapTable>

			{/*<button onClick={() => {console.log(this); getPosts()(this.props.dispatch, '14804188782990544648') }} > GetItem</button>*/}
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const length = state.article.length
	const currentState = state.article[length - 1]  // 一番新しいstateを取り出す
	return { article: currentState }  // 描画するのに必要なのはとりあえずitemsだけなのでitemsだけ返す
  //return  {article: state.article};
}

export default connect(mapStateToProps)(Form);
//export default Form;
