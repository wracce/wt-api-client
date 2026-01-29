try
{
	sDataTypePARAM = StrLowerCase(sDataTypePARAM);
}
catch(_X_)
{
	sDataTypePARAM = 'xml';
}
var oResulter = {'error':0,'messageText':'','result':'','total':0};
var TopElem = Child(0).Parent;
var MESSAGE = '';
var ERROR = 0;
if ( TopElem.code == 'uni_catalog_list' )
{
	var fldWvarCatalogName = TopElem.wvars.GetOptChildByKey( 'catalog_name' );
	if ( fldWvarCatalogName != undefined &amp;&amp; fldWvarCatalogName.value.HasValue )
	{
		var catCatalogRemoteCollection = ArrayOptFirstElem( XQuery( 'for $elem in remote_collections where $elem/code = ' + XQueryLiteral( 'uni_catalog_list_' + fldWvarCatalogName.value ) + ' return $elem/Fields(\'id\')' ) );
		if ( catCatalogRemoteCollection == undefined )
		{
			ERROR = 1;
			MESSAGE = ms_tools.get_const('nedostatochnopr');
		}
		else
		{
			var teRemoteCollection = OpenDoc( UrlFromDocID( catCatalogRemoteCollection.id ) ).TopElem;
			teRemoteCollection.sort_field_name = TopElem.sort_field_name;
			teRemoteCollection.sort_direction = TopElem.sort_direction;
			teRemoteCollection.view.referer_url = TopElem.view.referer_url;
			teRemoteCollection.tree_node_id = TopElem.tree_node_id;
			teRemoteCollection.page_index = TopElem.page_index;
			teRemoteCollection.page_size = TopElem.page_size;
			sXqueryQual = teRemoteCollection.wvars.ObtainChildByKey( 'xquery_qual' ).value.Value;
			if ( sXqueryQual != '' )
			{
				fldTEXqueryQual = TopElem.wvars.GetOptChildByKey( 'xquery_qual' );
				if ( fldTEXqueryQual != undefined &amp;&amp; fldTEXqueryQual.value.HasValue )
				{
					sXqueryQual += ' and ( ' + fldTEXqueryQual.value + ' )';
				}
			}
			else
			{
				fldTEXqueryQual = TopElem.wvars.GetOptChildByKey( 'xquery_qual' );
				if ( fldTEXqueryQual != undefined &amp;&amp; fldTEXqueryQual.value.HasValue )
				{
					sXqueryQual = fldTEXqueryQual.value;
				}
			}
			teRemoteCollection.wvars.AssignElem( TopElem.wvars );
			teRemoteCollection.wvars.ObtainChildByKey( 'xquery_qual' ).value = sXqueryQual;
			TopElem = teRemoteCollection;
		}
	}
}
else if ( TopElem.code != 'uni_catalog_list_menu' &amp;&amp; StrBegins( TopElem.code, 'uni_catalog_list_' ) )
{
	TopElem.wvars.ObtainChildByKey( 'catalog_name' ).value = StrReplace( TopElem.code, 'uni_catalog_list_', '' );
}
try
{
	oArgVars;
	if(DataType(oArgVars) == 'string')
		oArgVars = ParseJson(oArgVars);
}
catch(e)
{
	oArgVars = {};
}
var bArgVarHasAttribute = false;
for(i in oArgVars)
	bArgVarHasAttribute = true;
var RESULT = null;
var COLUMNS = Array();
var OUTFORMAT = sDataTypePARAM;
var RESULTSTREAM = new BufStream;
var DATA = new Object;
var TREE_NODE_ID = TopElem.tree_node_id.Value;
var SORT = new Object;
SORT.FIELD = (TopElem.sort_field_name.HasValue ? TopElem.sort_field_name.Value : null);
SORT.DIRECTION =	(StrLowerCase(TopElem.sort_direction.Value) == 'desc'? 'DESC' : 'ASC');
var PAGING = new Object;
PAGING.INDEX = TopElem.page_index.Value;
PAGING.START_INDEX = TopElem.start_index.Value;
PAGING.SIZE = TopElem.page_size.Value;
PAGING.MANUAL = false;
PAGING.TOTAL = null;
var COLUMNS_WHITELIST = (ArrayCount(TopElem.columns_white_list) > 0 ? ArrayExtract(TopElem.columns_white_list, 'This.Value') : null);
if ( TopElem.exec_code.code_type == 'cs' ) //С#
{
	wait = false;
	single = true;
	max_run_time = 120;
	oAssembly = tools.get_object_assembly( 'DatexCore' );
	oParseResult = oAssembly.CallClassStaticMethod( 'Datex.Core.CSharp', 'Parse', [ 1, TopElem.id, TopElem.code, TopElem.Name, TopElem.exec_code.code_text ] ); //Server Agent
	if ( oParseResult.Success )
	{
		oAssemblyResult = tools.dotnet_host.Object.GetAssembly( oParseResult.AssemblyName );
		oAssemblyResult.CallClassStaticMethod( oParseResult.EntryPointMemberFullName, '', [], single, wait,max_run_time );
	}
	else
	{
	}
}
else
{
	try
	{
		Request;
		Env = Request.Session.GetOptProperty('Env', ({}));
		InPlaceEval( tools_web.env_to_script( Env ) );
	}
	catch ( err )
	{
		ERROR = 1;
		MESSAGE = ms_tools.get_const('neobhodimoobno');
	}
	if ( ERROR == 0 )
	{
		try
		{
			curUserID;
		}
		catch ( err )
		{
			curUserID = null;
			curUser = null;
		}
		if ( ! tools_web.check_access( TopElem, curUserID, curUser, Request.Session ) )
		{
			ERROR = 1;
			MESSAGE = ms_tools.get_const('nedostatochnopr');
		}
	}
	if ( ERROR == 0 )
	{
		var __stamp, _oCache = null;
		if (TopElem.use_cache.Value > 0)
		{
			try
			{
				curObjectID;
			}
			catch(_x_)
			{
				curObjectID = null;
			}
			 __stamp = getStamp(curUserID, curObjectID);
			 _oCache = tools_web.get_user_data(__stamp);
			 if (_oCache != null)
			 {
				try
				{
					_oCache = ParseJson(_oCache);
				}
				catch(_x_)
				{
					_oCache = null;
				}
			 }
		}
		if (_oCache != null)
		{
			oResulter = _oCache;
		}
		else
		{
			var s_anti_str = bArgVarHasAttribute ? tools.object_to_script(oArgVars, false) : tools.wvars_to_script(TopElem.wvars, false);
			try
			{
				curUser = Env.GetOptProperty( 'curUser', null );
				tools_web.set_st_category( curUser );
			}
			catch ( err )
			{
			}
			
			try
			{
				if (TopElem.url.HasValue)
				{
					var sRenderUrl = TopElem.url.Value;
					if (!IsAbsoluteUrlStr(sRenderUrl))
						sRenderUrl = UrlAppendPath('x-local://wt/web', sRenderUrl);
					eval(s_anti_str + LoadUrlText(sRenderUrl));
				}
				else
					eval(s_anti_str + TopElem.script.Value);
				if (RESULT != null && IsArray(RESULT) == false) throw 'Result is not an array';
			}
			catch(_X_)
			{
				if (!IsCancelError(_X_) || (RESULT != null && IsArray(RESULT) == false))
				{
					ERROR = 1;
					MESSAGE = 'Error evaluating collection ' + TopElem.name.XQueryLiteral + '\n' + _X_;
					RESULT = Array();
					COLUMNS = Array();
					alert( MESSAGE );
				}
			}
			oResulter.total = OptInt(PAGING.TOTAL, (IsArray(RESULT) ? ArrayCount(RESULT) : oResulter.total));
			if (ERROR != 1)
			{
				if (PAGING.MANUAL == false)
				{
					if (TopElem.page_size.HasValue)
					{
						if (TopElem.page_index.HasValue)
						{
							if (oResulter.total &lt;= TopElem.page_index.Value * TopElem.page_size.Value)
								TopElem.page_index = 0;
							RESULT = ArrayRange(RESULT, TopElem.page_index.Value * TopElem.page_size.Value, TopElem.page_size.Value);
						}
						else
							RESULT = ArrayRange(RESULT, 0, TopElem.page_size.Value);
					}
				}
				else
				{
					TopElem.setPaging(PAGING.INDEX, PAGING.SIZE);
				}
			}
			if (OUTFORMAT == 'raw')
			{
				oResulter.result = RESULT;
				oResulter.columns = COLUMNS;
				oResulter.data = DATA;
			}
			else
			{
				if (IsArray(RESULT))
					oResulter.result = tools.array_to_text(RESULT, OUTFORMAT);
				else
				{
					oResulter.result = RESULTSTREAM.DetachStr();
					if (oResulter.result == '')
						oResulter.result = tools.array_to_text(([]), OUTFORMAT);
				}
				oResulter.columns = tools.array_to_text(COLUMNS, OUTFORMAT);
				oResulter.data = tools.object_to_text( DATA, OUTFORMAT );
			}
			
			if (TopElem.use_cache.Value > 0)
			{
				tools_web.set_user_data(__stamp, EncodeJson(oResulter), 86400);
			}
		}
	}
	else
	{
		oResulter.result = tools.array_to_text(([]), sDataTypePARAM);
		oResulter.columns = oResulter.result;
		oResulter.total = 0;
		oResulter.data = tools.object_to_text( DATA, OUTFORMAT );
	}
}
oResulter.sort_field_name = SORT.FIELD;
oResulter.sort_direction = (StrLowerCase(SORT.DIRECTION) == 'desc'? 'DESC':'ASC');
oResulter.error = OptInt(ERROR,0);
oResulter.messageText = String(MESSAGE);
return oResulter;